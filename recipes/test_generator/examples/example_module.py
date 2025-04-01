#!/usr/bin/env python3
"""Authentication Service for handling user authentication and token management."""

import datetime
import logging
from dataclasses import dataclass
from typing import Dict, Optional, Any

import jwt
from cryptography.exceptions import InvalidSignature

logger = logging.getLogger(__name__)


@dataclass
class AuthResult:
    """Result of an authentication attempt."""
    success: bool
    token: Optional[str] = None
    refresh_token: Optional[str] = None
    error: Optional[str] = None


@dataclass
class ValidationResult:
    """Result of a token validation."""
    valid: bool
    user_id: Optional[str] = None
    claims: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@dataclass
class RefreshResult:
    """Result of a token refresh attempt."""
    success: bool
    token: Optional[str] = None
    error: Optional[str] = None


class AuthError(Exception):
    """Base class for authentication errors."""
    pass


class InvalidCredentialsError(AuthError):
    """Raised when credentials don't match."""
    pass


class AccountLockoutError(AuthError):
    """Raised when account is locked due to too many attempts."""
    pass


class InactiveAccountError(AuthError):
    """Raised when account is not active."""
    pass


class ExpiredTokenError(AuthError):
    """Raised when token has expired."""
    pass


class InvalidTokenError(AuthError):
    """Raised when token is malformed or tampered."""
    pass


class RevokedTokenError(AuthError):
    """Raised when token has been revoked."""
    pass


class ExpiredRefreshTokenError(AuthError):
    """Raised when refresh token has expired."""
    pass


class InvalidRefreshTokenError(AuthError):
    """Raised when refresh token is invalid."""
    pass


class RevokedRefreshTokenError(AuthError):
    """Raised when refresh token has been revoked."""
    pass


class AuthenticationService:
    """Service for handling user authentication and token management."""

    def __init__(self, config: Dict[str, Any], db_interface=None):
        """Initialize the authentication service.
        
        Args:
            config: Configuration dictionary with auth settings
            db_interface: Interface for user data access
        """
        self.config = config
        self.db = db_interface
        self.secret_key = config.get("secret_key", "default_secret_key")
        self.token_expiry = config.get("token_expiry", 3600)  # 1 hour
        self.refresh_expiry = config.get("refresh_expiry", 86400 * 7)  # 7 days
        self.max_attempts = config.get("max_attempts", 5)
        self.token_algorithm = config.get("token_algorithm", "HS256")
        
        # Token revocation store - in a real implementation, this would be a database
        self.revoked_tokens = set()
        
        # Failed attempts tracking - in a real implementation, this would be in a database
        self.failed_attempts = {}
        
        logger.info("Authentication service initialized")

    def authenticate(self, username: str, password: str) -> AuthResult:
        """Authenticate a user with username and password.
        
        Args:
            username: User's username or email
            password: User's password
            
        Returns:
            AuthResult containing authentication result details
        """
        try:
            # Check for too many failed attempts
            if self._is_account_locked(username):
                logger.warning(f"Account locked due to too many failed attempts: {username}")
                return AuthResult(
                    success=False,
                    error="Account temporarily locked. Try again later."
                )
            
            # In a real implementation, this would fetch from a database
            # Here we're just checking against hardcoded values for example
            if not self._validate_credentials(username, password):
                self._record_failed_attempt(username)
                logger.warning(f"Failed authentication attempt for user: {username}")
                return AuthResult(
                    success=False,
                    error="Invalid username or password."
                )
            
            # Check if account is active
            if not self._is_account_active(username):
                logger.warning(f"Authentication attempt on inactive account: {username}")
                return AuthResult(
                    success=False,
                    error="Account is inactive. Please contact support."
                )
            
            # Reset failed attempts
            self._clear_failed_attempts(username)
            
            # Generate tokens
            user_id = self._get_user_id(username)
            token = self._generate_token(user_id)
            refresh_token = self._generate_refresh_token(user_id)
            
            logger.info(f"User authenticated successfully: {username}")
            return AuthResult(
                success=True,
                token=token,
                refresh_token=refresh_token
            )
            
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}", exc_info=True)
            return AuthResult(
                success=False,
                error="An unexpected error occurred. Please try again."
            )

    def validate_token(self, token: str) -> ValidationResult:
        """Validate a JWT token.
        
        Args:
            token: The JWT token to validate
            
        Returns:
            ValidationResult containing validation result details
        """
        try:
            # Check if token is revoked
            if token in self.revoked_tokens:
                return ValidationResult(
                    valid=False,
                    error="Token has been revoked."
                )
            
            # Verify token
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.token_algorithm]
            )
            
            # Extract user_id
            user_id = payload.get('sub')
            if not user_id:
                return ValidationResult(
                    valid=False,
                    error="Token is missing user identifier."
                )
            
            return ValidationResult(
                valid=True,
                user_id=user_id,
                claims=payload
            )
            
        except jwt.ExpiredSignatureError:
            logger.info("Token validation failed: expired token")
            return ValidationResult(
                valid=False,
                error="Token has expired."
            )
        except (jwt.InvalidTokenError, InvalidSignature):
            logger.warning("Token validation failed: invalid token")
            return ValidationResult(
                valid=False,
                error="Token is invalid."
            )
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}", exc_info=True)
            return ValidationResult(
                valid=False,
                error="An error occurred while validating the token."
            )

    def refresh_token(self, refresh_token: str) -> RefreshResult:
        """Use a refresh token to generate a new access token.
        
        Args:
            refresh_token: The refresh token
            
        Returns:
            RefreshResult containing the refresh result details
        """
        try:
            # Verify refresh token
            payload = jwt.decode(
                refresh_token,
                self.secret_key,
                algorithms=[self.token_algorithm]
            )
            
            # Check if it's a refresh token
            if payload.get('type') != 'refresh':
                logger.warning("Invalid token type used for refresh")
                return RefreshResult(
                    success=False,
                    error="Invalid refresh token."
                )
            
            # Check if token is revoked
            if refresh_token in self.revoked_tokens:
                logger.warning("Attempt to use revoked refresh token")
                return RefreshResult(
                    success=False,
                    error="Refresh token has been revoked."
                )
            
            # Extract user_id
            user_id = payload.get('sub')
            if not user_id:
                return RefreshResult(
                    success=False,
                    error="Refresh token is missing user identifier."
                )
            
            # Generate new access token
            new_token = self._generate_token(user_id)
            
            return RefreshResult(
                success=True,
                token=new_token
            )
            
        except jwt.ExpiredSignatureError:
            logger.info("Refresh failed: expired refresh token")
            return RefreshResult(
                success=False,
                error="Refresh token has expired."
            )
        except (jwt.InvalidTokenError, InvalidSignature):
            logger.warning("Refresh failed: invalid refresh token")
            return RefreshResult(
                success=False,
                error="Refresh token is invalid."
            )
        except Exception as e:
            logger.error(f"Refresh token error: {str(e)}", exc_info=True)
            return RefreshResult(
                success=False,
                error="An error occurred while refreshing the token."
            )

    def logout(self, token: str) -> bool:
        """Log out a user by revoking their token.
        
        Args:
            token: The JWT token to revoke
            
        Returns:
            Boolean indicating success
        """
        try:
            # Verify token first
            validation = self.validate_token(token)
            if not validation.valid:
                logger.warning("Attempt to logout with invalid token")
                return False
            
            # Revoke the token
            self.revoked_tokens.add(token)
            
            logger.info(f"User logged out: {validation.user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}", exc_info=True)
            return False

    def _validate_credentials(self, username: str, password: str) -> bool:
        """Validate user credentials.
        
        In a real implementation, this would check against a database.
        For this example, we're using hardcoded values.
        
        Args:
            username: User's username
            password: User's password
            
        Returns:
            Boolean indicating if credentials are valid
        """
        # This is just for example - in real code this would check a database
        valid_credentials = {
            "user@example.com": "password123",
            "admin@example.com": "admin456"
        }
        
        return valid_credentials.get(username) == password

    def _is_account_active(self, username: str) -> bool:
        """Check if user account is active.
        
        Args:
            username: User's username
            
        Returns:
            Boolean indicating if account is active
        """
        # This is just for example - in real code this would check a database
        inactive_accounts = ["inactive@example.com", "suspended@example.com"]
        return username not in inactive_accounts

    def _is_account_locked(self, username: str) -> bool:
        """Check if account is locked due to too many failed attempts.
        
        Args:
            username: User's username
            
        Returns:
            Boolean indicating if account is locked
        """
        if username not in self.failed_attempts:
            return False
            
        attempts, timestamp = self.failed_attempts[username]
        
        # If the lockout period has passed, reset the counter
        lockout_duration = self.config.get("lockout_duration", 300)  # 5 minutes
        if (datetime.datetime.now() - timestamp).total_seconds() > lockout_duration:
            self._clear_failed_attempts(username)
            return False
            
        return attempts >= self.max_attempts

    def _record_failed_attempt(self, username: str) -> None:
        """Record a failed authentication attempt.
        
        Args:
            username: User's username
        """
        now = datetime.datetime.now()
        
        if username in self.failed_attempts:
            attempts, _ = self.failed_attempts[username]
            self.failed_attempts[username] = (attempts + 1, now)
        else:
            self.failed_attempts[username] = (1, now)

    def _clear_failed_attempts(self, username: str) -> None:
        """Clear failed authentication attempts.
        
        Args:
            username: User's username
        """
        if username in self.failed_attempts:
            del self.failed_attempts[username]

    def _get_user_id(self, username: str) -> str:
        """Get user ID from username.
        
        Args:
            username: User's username
            
        Returns:
            User ID
        """
        # This is just for example - in real code this would get from a database
        return f"user_{hash(username) % 10000}"

    def _generate_token(self, user_id: str) -> str:
        """Generate a JWT token for a user.
        
        Args:
            user_id: User's ID
            
        Returns:
            JWT token
        """
        now = datetime.datetime.now()
        expiry = now + datetime.timedelta(seconds=self.token_expiry)
        
        payload = {
            'sub': user_id,
            'iat': now.timestamp(),
            'exp': expiry.timestamp(),
            'type': 'access'
        }
        
        return jwt.encode(
            payload,
            self.secret_key,
            algorithm=self.token_algorithm
        )

    def _generate_refresh_token(self, user_id: str) -> str:
        """Generate a refresh token for a user.
        
        Args:
            user_id: User's ID
            
        Returns:
            Refresh token
        """
        now = datetime.datetime.now()
        expiry = now + datetime.timedelta(seconds=self.refresh_expiry)
        
        payload = {
            'sub': user_id,
            'iat': now.timestamp(),
            'exp': expiry.timestamp(),
            'type': 'refresh'
        }
        
        return jwt.encode(
            payload,
            self.secret_key,
            algorithm=self.token_algorithm
        )