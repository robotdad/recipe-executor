#!/usr/bin/env python3
"""
Core data repository module defining interfaces and base implementation.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional, Any, Dict

T = TypeVar('T')  # Entity type


class RepositoryError(Exception):
    """Base exception for repository errors."""
    pass


class EntityNotFoundError(RepositoryError):
    """Raised when an entity is not found."""
    pass


class DuplicateEntityError(RepositoryError):
    """Raised when attempting to create a duplicate entity."""
    pass


class DataRepository(Generic[T], ABC):
    """Generic repository interface for data access operations."""
    
    @abstractmethod
    def get_by_id(self, id: Any) -> Optional[T]:
        """
        Retrieve an entity by its ID.
        
        Args:
            id: The entity ID
            
        Returns:
            The entity if found, None otherwise
            
        Raises:
            RepositoryError: If a repository operation fails
        """
        pass
        
    @abstractmethod
    def get_all(self, **filters) -> List[T]:
        """
        Retrieve all entities, optionally filtered.
        
        Args:
            **filters: Filter parameters
            
        Returns:
            List of entities matching the filters
            
        Raises:
            RepositoryError: If a repository operation fails
        """
        pass
        
    @abstractmethod
    def create(self, entity: T) -> T:
        """
        Create a new entity.
        
        Args:
            entity: The entity to create
            
        Returns:
            The created entity with any generated fields (e.g., ID)
            
        Raises:
            DuplicateEntityError: If the entity already exists
            RepositoryError: If a repository operation fails
        """
        pass
        
    @abstractmethod
    def update(self, entity: T) -> T:
        """
        Update an existing entity.
        
        Args:
            entity: The entity to update
            
        Returns:
            The updated entity
            
        Raises:
            EntityNotFoundError: If the entity is not found
            RepositoryError: If a repository operation fails
        """
        pass
        
    @abstractmethod
    def delete(self, id: Any) -> bool:
        """
        Delete an entity by its ID.
        
        Args:
            id: The entity ID
            
        Returns:
            True if the entity was deleted, False if it didn't exist
            
        Raises:
            RepositoryError: If a repository operation fails
        """
        pass
        
    @abstractmethod
    def begin_transaction(self):
        """
        Begin a new transaction.
        
        Raises:
            RepositoryError: If a repository operation fails
        """
        pass
        
    @abstractmethod
    def commit(self):
        """
        Commit the current transaction.
        
        Raises:
            RepositoryError: If a repository operation fails
        """
        pass
        
    @abstractmethod
    def rollback(self):
        """
        Rollback the current transaction.
        
        Raises:
            RepositoryError: If a repository operation fails
        """
        pass


class InMemoryRepository(DataRepository[T], Generic[T]):
    """
    Simple in-memory implementation of the repository interface.
    Useful for testing or simple applications.
    """
    
    def __init__(self, id_field: str = 'id'):
        """
        Initialize the repository.
        
        Args:
            id_field: The name of the ID field on the entity
        """
        self.entities: Dict[Any, T] = {}
        self.id_field = id_field
        self.next_id = 1
        self.in_transaction = False
        self.transaction_snapshot = None
    
    def get_by_id(self, id: Any) -> Optional[T]:
        """Retrieve an entity by its ID."""
        return self.entities.get(id)
    
    def get_all(self, **filters) -> List[T]:
        """Retrieve all entities, optionally filtered."""
        if not filters:
            return list(self.entities.values())
        
        result = []
        for entity in self.entities.values():
            match = True
            for key, value in filters.items():
                if not hasattr(entity, key) or getattr(entity, key) != value:
                    match = False
                    break
            if match:
                result.append(entity)
        return result
    
    def create(self, entity: T) -> T:
        """Create a new entity."""
        # Generate ID if not provided
        if getattr(entity, self.id_field) is None:
            setattr(entity, self.id_field, self.next_id)
            self.next_id += 1
        
        entity_id = getattr(entity, self.id_field)
        
        # Check for duplicates
        if entity_id in self.entities:
            raise DuplicateEntityError(f"Entity with ID {entity_id} already exists")
        
        self.entities[entity_id] = entity
        return entity
    
    def update(self, entity: T) -> T:
        """Update an existing entity."""
        entity_id = getattr(entity, self.id_field)
        
        if entity_id not in self.entities:
            raise EntityNotFoundError(f"Entity with ID {entity_id} not found")
        
        self.entities[entity_id] = entity
        return entity
    
    def delete(self, id: Any) -> bool:
        """Delete an entity by its ID."""
        if id not in self.entities:
            return False
        
        del self.entities[id]
        return True
    
    def begin_transaction(self):
        """Begin a new transaction."""
        self.in_transaction = True
        # Take a snapshot of the current state
        self.transaction_snapshot = {k: v for k, v in self.entities.items()}
    
    def commit(self):
        """Commit the current transaction."""
        self.in_transaction = False
        self.transaction_snapshot = None
    
    def rollback(self):
        """Rollback the current transaction."""
        if self.in_transaction and self.transaction_snapshot is not None:
            self.entities = self.transaction_snapshot
        self.in_transaction = False
        self.transaction_snapshot = None