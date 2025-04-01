# Library Integration Specification: SQLAlchemy ORM Adapter

## Overview

This specification describes the integration of SQLAlchemy into our application's data access layer. The integration will provide a clean abstraction over database operations while leveraging SQLAlchemy's powerful ORM capabilities.

## Core Component Description

Our data access layer currently consists of a generic `DataRepository` interface that defines common CRUD operations. We need to implement this interface using SQLAlchemy as the underlying ORM library while maintaining a clean separation between our domain model and the database implementation.

## Integration Requirements

### Functional Requirements

1. Implement the `DataRepository` interface using SQLAlchemy
2. Support all CRUD operations (create, read, update, delete)
3. Handle relationships between entities
4. Support transactions and session management
5. Provide efficient query capabilities
6. Maintain clean separation between domain and data access layers
7. Handle connection pooling and lifecycle management

### Non-Functional Requirements

1. Minimize direct coupling to SQLAlchemy in domain code
2. Ensure proper resource cleanup (connections, sessions)
3. Support efficient batch operations
4. Implement appropriate error handling and translation
5. Maintain type safety throughout the integration

### Existing Interface

```python
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional, Any, Dict

T = TypeVar('T')  # Entity type

class DataRepository(Generic[T], ABC):
    """Generic repository interface for data access operations."""
    
    @abstractmethod
    def get_by_id(self, id: Any) -> Optional[T]:
        """Retrieve an entity by its ID."""
        pass
        
    @abstractmethod
    def get_all(self, **filters) -> List[T]:
        """Retrieve all entities, optionally filtered."""
        pass
        
    @abstractmethod
    def create(self, entity: T) -> T:
        """Create a new entity."""
        pass
        
    @abstractmethod
    def update(self, entity: T) -> T:
        """Update an existing entity."""
        pass
        
    @abstractmethod
    def delete(self, id: Any) -> bool:
        """Delete an entity by its ID."""
        pass
        
    @abstractmethod
    def begin_transaction(self):
        """Begin a new transaction."""
        pass
        
    @abstractmethod
    def commit(self):
        """Commit the current transaction."""
        pass
        
    @abstractmethod
    def rollback(self):
        """Rollback the current transaction."""
        pass
```

## Integration Architecture

### Component Structure

```
data_access/
  ├── __init__.py
  ├── interfaces.py        # Contains DataRepository interface
  ├── exceptions.py        # Custom exceptions
  ├── sqlalchemy/
  │   ├── __init__.py
  │   ├── base_repository.py  # SQLAlchemy implementation of repository
  │   ├── models/            # SQLAlchemy models
  │   │   ├── __init__.py
  │   │   └── base.py        # Base model class
  │   ├── session.py         # Session management
  │   └── mappings.py        # Entity to model mappings
  └── factories.py          # Factory for creating repositories
```

### Integration Components

1. **Repository Implementation**: 
   - `SQLAlchemyRepository` class implementing the `DataRepository` interface
   - Generic implementation that works with any entity type

2. **Session Management**:
   - `SessionManager` class for managing SQLAlchemy sessions
   - Connection pooling and lifecycle management
   - Transaction handling

3. **Model Mappings**:
   - Mapping between domain entities and SQLAlchemy models
   - Conversion functions for bidirectional mapping

4. **Repository Factory**:
   - Factory function/class for creating repositories for specific entity types
   - Configuration injection

## API Design

### SQLAlchemy Repository

```python
from typing import Generic, TypeVar, List, Optional, Any, Dict, Type
from sqlalchemy.orm import Session
from .interfaces import DataRepository
from .session import SessionManager

T = TypeVar('T')  # Entity type
M = TypeVar('M')  # Model type

class SQLAlchemyRepository(DataRepository[T], Generic[T, M]):
    """SQLAlchemy implementation of the DataRepository interface."""
    
    def __init__(self, 
                 session_manager: SessionManager,
                 model_class: Type[M],
                 entity_class: Type[T],
                 entity_to_model: callable,
                 model_to_entity: callable):
        """
        Initialize the repository.
        
        Args:
            session_manager: Manager for SQLAlchemy sessions
            model_class: SQLAlchemy model class
            entity_class: Domain entity class
            entity_to_model: Function to convert entity to model
            model_to_entity: Function to convert model to entity
        """
        self.session_manager = session_manager
        self.model_class = model_class
        self.entity_class = entity_class
        self.entity_to_model = entity_to_model
        self.model_to_entity = model_to_entity
        self._current_session = None
    
    @property
    def session(self) -> Session:
        """Get the current session or create a new one."""
        if self._current_session is None:
            self._current_session = self.session_manager.get_session()
        return self._current_session
    
    def get_by_id(self, id: Any) -> Optional[T]:
        """Retrieve an entity by its ID."""
        model = self.session.query(self.model_class).get(id)
        if model is None:
            return None
        return self.model_to_entity(model)
    
    def get_all(self, **filters) -> List[T]:
        """Retrieve all entities, optionally filtered."""
        query = self.session.query(self.model_class)
        
        # Apply filters if provided
        if filters:
            query = query.filter_by(**filters)
            
        models = query.all()
        return [self.model_to_entity(model) for model in models]
    
    def create(self, entity: T) -> T:
        """Create a new entity."""
        model = self.entity_to_model(entity)
        self.session.add(model)
        self.session.flush()  # Flush to get the ID
        return self.model_to_entity(model)
    
    def update(self, entity: T) -> T:
        """Update an existing entity."""
        model = self.entity_to_model(entity)
        self.session.merge(model)
        self.session.flush()
        return self.model_to_entity(model)
    
    def delete(self, id: Any) -> bool:
        """Delete an entity by its ID."""
        model = self.session.query(self.model_class).get(id)
        if model is None:
            return False
        self.session.delete(model)
        return True
    
    def begin_transaction(self):
        """Begin a new transaction."""
        # Session is created on first access
        _ = self.session
    
    def commit(self):
        """Commit the current transaction."""
        if self._current_session:
            self._current_session.commit()
            self._current_session = None
    
    def rollback(self):
        """Rollback the current transaction."""
        if self._current_session:
            self._current_session.rollback()
            self._current_session = None
```

### Session Management

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager

class SessionManager:
    """Manages SQLAlchemy sessions and engine configuration."""
    
    def __init__(self, connection_string: str, **engine_kwargs):
        """
        Initialize the session manager.
        
        Args:
            connection_string: Database connection string
            engine_kwargs: Additional arguments for engine creation
        """
        self.engine = create_engine(connection_string, **engine_kwargs)
        self.Session = scoped_session(sessionmaker(bind=self.engine))
    
    def get_session(self):
        """Get a new session."""
        return self.Session()
    
    @contextmanager
    def session_scope(self):
        """Provide a transactional scope around a series of operations."""
        session = self.get_session()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()
```

### Repository Factory

```python
from typing import Type, Dict, Callable, TypeVar, Generic
from .interfaces import DataRepository
from .sqlalchemy.base_repository import SQLAlchemyRepository
from .sqlalchemy.session import SessionManager

T = TypeVar('T')  # Entity type
M = TypeVar('M')  # Model type

class RepositoryFactory:
    """Factory for creating repositories."""
    
    def __init__(self, session_manager: SessionManager):
        """
        Initialize the factory.
        
        Args:
            session_manager: SQLAlchemy session manager
        """
        self.session_manager = session_manager
        self.mappings: Dict[Type, Dict] = {}
    
    def register_mapping(self,
                         entity_class: Type[T],
                         model_class: Type[M],
                         entity_to_model: Callable[[T], M],
                         model_to_entity: Callable[[M], T]):
        """
        Register a mapping between an entity class and a model class.
        
        Args:
            entity_class: Domain entity class
            model_class: SQLAlchemy model class
            entity_to_model: Function to convert entity to model
            model_to_entity: Function to convert model to entity
        """
        self.mappings[entity_class] = {
            'model_class': model_class,
            'entity_to_model': entity_to_model,
            'model_to_entity': model_to_entity
        }
    
    def create_repository(self, entity_class: Type[T]) -> DataRepository[T]:
        """
        Create a repository for the specified entity class.
        
        Args:
            entity_class: Domain entity class
            
        Returns:
            A repository for the entity class
            
        Raises:
            ValueError: If no mapping is registered for the entity class
        """
        if entity_class not in self.mappings:
            raise ValueError(f"No mapping registered for entity class: {entity_class.__name__}")
        
        mapping = self.mappings[entity_class]
        
        return SQLAlchemyRepository(
            session_manager=self.session_manager,
            model_class=mapping['model_class'],
            entity_class=entity_class,
            entity_to_model=mapping['entity_to_model'],
            model_to_entity=mapping['model_to_entity']
        )
```

## Error Handling

### Error Mapping

- Map SQLAlchemy exceptions to application-specific exceptions
- Provide clear error messages that hide implementation details
- Ensure consistent error handling across the application

```python
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, NoResultFound
from .interfaces import RepositoryError, EntityNotFoundError, DuplicateEntityError

class SQLAlchemyRepositoryError(RepositoryError):
    """Base class for SQLAlchemy repository errors."""
    pass

def handle_sqlalchemy_error(func):
    """Decorator to handle SQLAlchemy errors."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except NoResultFound:
            raise EntityNotFoundError("Entity not found")
        except IntegrityError as e:
            if "duplicate" in str(e).lower() or "unique" in str(e).lower():
                raise DuplicateEntityError("Entity already exists")
            raise SQLAlchemyRepositoryError(f"Data integrity error: {str(e)}")
        except SQLAlchemyError as e:
            raise SQLAlchemyRepositoryError(f"Database error: {str(e)}")
    return wrapper
```

## Configuration

### SQLAlchemy Configuration

- Connection string configuration
- Engine configuration (pool size, timeouts, etc.)
- Session configuration
- Model metadata configuration

```python
# Example configuration
SQLALCHEMY_CONFIG = {
    'connection_string': 'postgresql://user:password@localhost/dbname',
    'pool_size': 10,
    'max_overflow': 20,
    'pool_timeout': 30,
    'pool_recycle': 3600,
    'echo': False  # Set to True for query logging
}

# Usage
session_manager = SessionManager(
    SQLALCHEMY_CONFIG['connection_string'],
    pool_size=SQLALCHEMY_CONFIG['pool_size'],
    max_overflow=SQLALCHEMY_CONFIG['max_overflow'],
    pool_timeout=SQLALCHEMY_CONFIG['pool_timeout'],
    pool_recycle=SQLALCHEMY_CONFIG['pool_recycle'],
    echo=SQLALCHEMY_CONFIG['echo']
)
```

## Usage Examples

### Basic Repository Usage

```python
# Domain entity
class User:
    def __init__(self, id=None, name=None, email=None):
        self.id = id
        self.name = name
        self.email = email

# Get repository from factory
repository_factory = RepositoryFactory(session_manager)
user_repository = repository_factory.create_repository(User)

# Create a new user
new_user = User(name="John Doe", email="john@example.com")
created_user = user_repository.create(new_user)
user_repository.commit()

# Retrieve a user
user = user_repository.get_by_id(created_user.id)

# Update a user
user.name = "Jane Doe"
updated_user = user_repository.update(user)
user_repository.commit()

# Delete a user
user_repository.delete(user.id)
user_repository.commit()
```

### Transaction Usage

```python
# Using explicit transaction management
user_repository.begin_transaction()
try:
    user1 = User(name="User 1", email="user1@example.com")
    user2 = User(name="User 2", email="user2@example.com")
    
    user_repository.create(user1)
    user_repository.create(user2)
    
    user_repository.commit()
except Exception:
    user_repository.rollback()
    raise

# Using context manager
with session_manager.session_scope() as session:
    # Create a repository with the session
    repo = SQLAlchemyRepository(session, UserModel, User, entity_to_model, model_to_entity)
    
    user = User(name="User", email="user@example.com")
    repo.create(user)
    # Session is committed automatically on context exit
```

## Testing Strategy

1. **Unit Tests**:
   - Test repository implementation with mock session
   - Test error handling and mapping
   - Test entity-model conversions

2. **Integration Tests**:
   - Test with in-memory SQLite database
   - Verify CRUD operations with actual database
   - Test transaction behavior

3. **Performance Tests**:
   - Test connection pooling behavior
   - Verify query efficiency
   - Test batch operations

## Implementation Notes

1. **Model/Entity Separation**:
   - Keep SQLAlchemy models separate from domain entities
   - Use explicit mapping functions rather than inheritance
   - Handle relationships carefully in mappings

2. **Session Management**:
   - Use scoped sessions for multi-threaded environments
   - Properly clean up sessions to avoid leaks
   - Configure appropriate connection pooling

3. **Query Optimization**:
   - Use eager loading for relationships when appropriate
   - Implement custom query methods for complex queries
   - Consider adding pagination support

4. **Extensions**:
   - Support for advanced SQLAlchemy features (events, association proxies)
   - Integration with migrations (Alembic)
   - Support for multiple database engines