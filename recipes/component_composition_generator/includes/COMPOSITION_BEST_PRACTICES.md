# Component Composition Best Practices

This document outlines best practices for composing multiple subcomponents into cohesive, maintainable components.

## Core Principles

### 1. Separation of Concerns

- Each subcomponent should have a single, well-defined responsibility
- The parent component should orchestrate subcomponents but avoid duplicating their logic
- Define clear interfaces between subcomponents
- Avoid direct subcomponent-to-subcomponent communication when possible

### 2. Clean Integration Architecture

- Create a consistent pattern for component composition
- Establish predictable data flow between components
- Use dependency injection when appropriate
- Document the relationship between subcomponents clearly

### 3. State Management

- Decide on appropriate state ownership (parent vs. subcomponent)
- Lift state up to the necessary level, but no higher
- Avoid prop drilling through more than one level
- Consider context or dedicated state management for complex state sharing

### 4. Interface Design

- Create clear, consistent props interfaces
- Use TypeScript interfaces or PropTypes to document component contracts
- Follow consistent naming conventions
- Keep component APIs small and focused

## Import and Export Patterns

### 1. Index Files

- Use barrel exports (index.js/ts files) to simplify imports
- Create a consistent export structure across components
- Consider named vs. default exports based on project conventions
- Document the public API of each component

```javascript
// Good index.js example
export { default as CompositeComponent } from './CompositeComponent';
export * from './types';
export * from './hooks';
```

### 2. Import Organization

- Group imports logically (React, third-party, internal)
- Consider alphabetical ordering within groups
- Import only what's needed
- Use path aliases for cleaner imports

```javascript
// Good import organization
// External dependencies
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Internal components
import { Header } from './components/Header';
import { Content } from './components/Content';
import { Footer } from './components/Footer';

// Utilities and hooks
import { useTheme } from './hooks/useTheme';
import { formatData } from './utils/formatters';
```

## Component Communication Patterns

### 1. Props Passing

- Pass only necessary props to subcomponents
- Use prop spreading sparingly and explicitly
- Consider using a component composition pattern rather than excessive props

```javascript
// Good props passing
<UserProfile 
  user={user}
  onUpdate={handleUpdate}
  renderAvatar={() => <Avatar user={user} size="large" />}
/>
```

### 2. Callbacks and Events

- Use consistent callback naming (onEvent for events, handleEvent for handlers)
- Ensure event handlers are properly bound or memoized
- Pass minimal data in callbacks (identifiers rather than objects when possible)
- Document expected callback signatures

### 3. Context API

- Use Context for truly global state or deeply nested components
- Create purpose-specific contexts rather than a single large one
- Consider performance implications (Context triggers rerenders)
- Document the shape and purpose of each context

```javascript
// Good Context example
const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Code Organization

### 1. Directory Structure

- Organize files by feature or component
- Keep related files together
- Consider a modular structure for large components
- Use consistent naming conventions

```
ComponentName/
  ├── index.ts             # Barrel exports
  ├── ComponentName.tsx    # Main component
  ├── ComponentName.test.tsx
  ├── ComponentName.stories.tsx
  ├── components/          # Subcomponents
  │   ├── SubComponentA.tsx
  │   └── SubComponentB.tsx
  ├── hooks/               # Component-specific hooks
  ├── utils/               # Component-specific utilities
  └── types.ts             # TypeScript interfaces/types
```

### 2. File Organization

- Keep files focused and reasonably sized
- Use consistent sectioning within files
- Group related functionality
- Place types and interfaces in logical locations

## Type Sharing (TypeScript)

### 1. Type Definition Patterns

- Define shared types in a central location
- Use interfaces for objects that will be instantiated
- Use type aliases for unions, intersections, and complex types
- Export types that are part of the public API

```typescript
// Good type sharing
// types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserWithRole extends User {
  role: UserRole;
}
```

### 2. Prop Types

- Use consistent interfaces for component props
- Prefix prop interfaces with ComponentNameProps
- Document required vs. optional props clearly
- Consider using Pick<> and Omit<> for related component props

```typescript
// Good prop types
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary';
  size: 'sm' | 'md' | 'lg';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// For a specialized button
interface IconButtonProps extends Omit<ButtonProps, 'label'> {
  icon: React.ReactNode;
}
```

## Component Composition Patterns

### 1. Compound Components

- Use when subcomponents are tightly coupled and used together
- Provides better API clarity and flexibility
- Implement with React.Children or Context

```javascript
// Compound components pattern
<Tabs>
  <Tab title="First Tab">Content for first tab</Tab>
  <Tab title="Second Tab">Content for second tab</Tab>
</Tabs>
```

### 2. Render Props

- Use for flexible rendering while sharing behavior
- Great for components that need to control what/when to render
- Consider performance implications

```javascript
// Render props pattern
<DataFetcher url="/api/data">
  {(data, isLoading, error) => (
    isLoading ? <Spinner /> : error ? <Error message={error} /> : <DataTable data={data} />
  )}
</DataFetcher>
```

### 3. Higher-Order Components (HOCs)

- Use for adding behavior to multiple components
- Follow naming convention: `withFeature`
- Document expected props and injected props
- Consider composability with other HOCs

```javascript
// HOC pattern
const withAuthentication = (Component) => {
  return (props) => {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
      return <LoginRedirect />;
    }
    
    return <Component {...props} user={user} />;
  };
};

const UserProfile = withAuthentication(UserProfileBase);
```

### 4. Custom Hooks

- Use for sharing logic between components
- Name with `use` prefix
- Focus each hook on a specific concern
- Document hook interfaces clearly

```javascript
// Custom hook pattern
function useSortableData(items, config = { key: 'id', direction: 'ascending' }) {
  const [sortConfig, setSortConfig] = useState(config);
  
  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [items, sortConfig]);
  
  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending',
    }));
  };
  
  return { items: sortedItems, requestSort, sortConfig };
}
```

## Performance Considerations

### 1. Component Optimization

- Memoize expensive components with React.memo
- Use callback memoization (useCallback) for event handlers passed as props
- Memoize derived data with useMemo
- Be intentional about dependencies in hooks

### 2. Rendering Optimization

- Avoid unnecessary re-renders
- Break down large components into smaller ones
- Consider lazy loading for large subcomponents
- Use virtualization for long lists

## Testing Considerations

### 1. Component Testing

- Test integrated components as a unit
- Test key interactions between subcomponents
- Mock subcomponents when appropriate for isolation
- Test edge cases in integration

### 2. Contracts Testing

- Verify that subcomponents receive expected props
- Test that parent components respond correctly to subcomponent callbacks
- Verify that shared state is managed correctly
- Test that integration interface requirements are met

## Common Patterns for Specific Component Types

### 1. Form Composition

- Use a form provider component for form state
- Create specialized form field components
- Implement consistent validation patterns
- Handle form submission at the parent level

### 2. Data Display Components

- Separate data fetching from presentation
- Create composable table/list components
- Implement consistent loading and error states
- Consider pagination and filtering as higher-level concerns

### 3. Layout Components

- Create flexible container components
- Use composition for complex layouts
- Implement responsive behavior consistently
- Consider accessibility in layout design

## Examples

### Good Component Composition

```jsx
// Parent component that composes subcomponents with clean interfaces
const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [userId]);
  
  const handleProfileUpdate = async (updates) => {
    try {
      const updatedUser = await updateUser(userId, updates);
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <NotFound resource="User" />;
  
  return (
    <DashboardLayout>
      <UserProfile 
        user={user} 
        onUpdate={handleProfileUpdate} 
      />
      <UserStats 
        stats={user.stats} 
      />
      <UserActivityFeed 
        userId={userId} 
        limit={10} 
      />
    </DashboardLayout>
  );
};
```

### Poor Component Composition

```jsx
// Problematic component with tight coupling and unclear responsibilities
const BadUserDashboard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({});
  // ...many more state variables and mixed concerns
  
  // Direct manipulation of subcomponent state and behavior
  const openEditForm = () => {
    setIsEditingProfile(true);
    setFormData({
      name: userData.name,
      email: userData.email,
      // ...more fields
    });
  };
  
  return (
    <div>
      {/* Mixed UI responsibilities and prop drilling */}
      <div className="user-profile">
        <img src={userData?.avatar} alt={userData?.name} />
        <h2>{userData?.name}</h2>
        <button onClick={openEditForm}>Edit</button>
        {isEditingProfile && (
          <form onSubmit={/* complex inline submit handler */}>
            {/* Form fields with inline handlers */}
          </form>
        )}
      </div>
      
      {/* Direct manipulation of what should be subcomponent state */}
      <div className="user-stats">
        {/* Complex stats rendering with inline calculations */}
      </div>
      
      {/* Too many responsibilities in one component */}
      <div className="activity-feed">
        {/* Complex activity rendering with mixed concerns */}
      </div>
    </div>
  );
};
```

## Python-Specific Composition Patterns

### 1. Module and Package Structure

#### Python Package Organization

- Organize related modules into packages with `__init__.py` files
- Use the `__init__.py` file to control what is exposed from the package
- Consider namespace packages for large component collections
- Follow consistent naming conventions (snake_case for modules and packages)

```
my_component/
  ├── __init__.py          # Exposes the public API
  ├── core.py              # Core functionality
  ├── exceptions.py        # Custom exceptions
  ├── utils/               # Utility subpackage
  │   ├── __init__.py
  │   ├── formatters.py
  │   └── validators.py
  └── integrations/        # External integrations
      ├── __init__.py
      ├── database.py
      └── api.py
```

#### Well-Designed `__init__.py` Files

Control your component's public API through your `__init__.py` files:

```python
# __init__.py example for clean API exposure
from .core import MyComponent, configure_component
from .exceptions import ComponentError, ValidationError

__all__ = ['MyComponent', 'configure_component', 'ComponentError', 'ValidationError']

# Version information
__version__ = '1.0.0'
```

### 2. Composition Approaches

#### Class Composition and Inheritance

- Favor composition over inheritance where possible
- Use inheritance for genuine "is-a" relationships
- Create clear class hierarchies with single responsibility
- Use mixins for cross-cutting concerns

```python
# Good composition example
class DatabaseConnection:
    def __init__(self, config):
        self.config = config
        
    def connect(self):
        # Connection logic
        pass
        
class QueryBuilder:
    def __init__(self):
        self.query = ""
        
    def select(self, fields):
        # Build SELECT query
        return self
        
    def where(self, condition):
        # Add WHERE clause
        return self
        
class DatabaseClient:
    def __init__(self, config):
        self.connection = DatabaseConnection(config)
        self.query_builder = QueryBuilder()
        
    def execute_query(self, query):
        conn = self.connection.connect()
        # Execute query logic
        return results
        
    def query(self):
        # Return query builder for fluent interface
        return self.query_builder
```

#### Dependency Injection

- Pass dependencies to classes rather than creating them internally
- Use constructor injection for required dependencies
- Consider factories for complex object creation
- Use dependency containers for larger applications

```python
# Good dependency injection
class UserService:
    def __init__(self, db_client, logger, cache_manager=None):
        self.db_client = db_client
        self.logger = logger
        self.cache_manager = cache_manager
        
    def get_user(self, user_id):
        # Implementation using injected dependencies
        pass
```

### 3. Interface Definition

#### Abstract Base Classes

- Use ABC module for defining interfaces
- Create abstract base classes for component contracts
- Define clear method signatures
- Document expected behavior

```python
from abc import ABC, abstractmethod

class AuthProvider(ABC):
    @abstractmethod
    def authenticate(self, username: str, password: str) -> bool:
        """Authenticate a user with username and password."""
        pass
        
    @abstractmethod
    def get_user_info(self, user_id: str) -> dict:
        """Retrieve user information."""
        pass
        
# Implementations
class LocalAuthProvider(AuthProvider):
    def authenticate(self, username: str, password: str) -> bool:
        # Local authentication implementation
        pass
        
    def get_user_info(self, user_id: str) -> dict:
        # Local user info implementation
        pass
```

#### Protocol Classes (Python 3.8+)

- Use Protocol classes for structural typing
- Better for duck typing and looser coupling
- Great for defining expected behavior without inheritance

```python
from typing import Protocol

class DataSource(Protocol):
    def get_data(self, query: str) -> list:
        """Return data matching the query."""
        ...
        
# Any class with a compatible get_data method works
class DatabaseSource:
    def get_data(self, query: str) -> list:
        # Database implementation
        return db_results
        
class APISource:
    def get_data(self, query: str) -> list:
        # API implementation
        return api_results
        
def process_data(source: DataSource, query: str) -> list:
    # Works with any source implementing the protocol
    return source.get_data(query)
```

### 4. Event-Based Communication

#### Observer Pattern

- Use for loose coupling between components
- Implement with callback registries or event classes
- Consider using Python's built-in `collections.defaultdict` for event handlers
- Document event contract clearly

```python
# Event system implementation
class EventEmitter:
    def __init__(self):
        self.handlers = defaultdict(list)
        
    def on(self, event_name, handler):
        self.handlers[event_name].append(handler)
        return self
        
    def off(self, event_name, handler):
        if handler in self.handlers[event_name]:
            self.handlers[event_name].remove(handler)
        return self
        
    def emit(self, event_name, *args, **kwargs):
        for handler in self.handlers[event_name]:
            handler(*args, **kwargs)
        return self
```

#### Signal/Slot System

- Consider a signal/slot system for more complex applications
- Implement with descriptor protocol or decorators
- Document signal interfaces clearly
- Consider existing libraries like PySignal or Blinker

```python
# Simple signal implementation
class Signal:
    def __init__(self):
        self.receivers = []
        
    def connect(self, receiver):
        self.receivers.append(receiver)
        
    def disconnect(self, receiver):
        if receiver in self.receivers:
            self.receivers.remove(receiver)
            
    def emit(self, *args, **kwargs):
        for receiver in self.receivers:
            receiver(*args, **kwargs)
            
# Usage
class DataManager:
    data_changed = Signal()
    
    def update_data(self, new_data):
        # Update logic
        self.data_changed.emit(new_data)
```

### 5. Context Managers for Resource Management

- Use context managers for component setup/teardown
- Implement `__enter__` and `__exit__` methods
- Handle exceptions appropriately
- Document the expected lifecycle

```python
class DatabaseSession:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.connection = None
        
    def __enter__(self):
        self.connection = create_connection(self.connection_string)
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            self.connection.close()
            
    def execute(self, query):
        # Execution logic
        pass
        
# Usage
with DatabaseSession("connection_string") as session:
    results = session.execute("SELECT * FROM users")
```

### 6. Factories and Builders

- Use factories for complex object creation
- Implement builders for step-by-step construction
- Consider factory functions for simple cases
- Use class methods as alternative constructors

```python
# Factory function
def create_auth_provider(provider_type, config):
    if provider_type == "local":
        return LocalAuthProvider(config)
    elif provider_type == "oauth":
        return OAuthProvider(config)
    elif provider_type == "ldap":
        return LDAPProvider(config)
    else:
        raise ValueError(f"Unknown provider type: {provider_type}")
        
# Builder pattern
class QueryBuilder:
    def __init__(self):
        self.query_parts = []
        
    def select(self, fields):
        self.query_parts.append(f"SELECT {', '.join(fields)}")
        return self
        
    def from_table(self, table):
        self.query_parts.append(f"FROM {table}")
        return self
        
    def where(self, condition):
        self.query_parts.append(f"WHERE {condition}")
        return self
        
    def build(self):
        return " ".join(self.query_parts)
```

## Conclusion

Component composition is a powerful pattern in both front-end and back-end development. By following these best practices, you can create maintainable, testable, and flexible component structures that scale with your application's needs.

Remember that good composition starts with good component design - each component should have a clear purpose and interface. With thoughtful composition, your component library can become a powerful toolkit for building consistent, high-quality applications, whether in JavaScript/TypeScript UI components or Python modules and services.