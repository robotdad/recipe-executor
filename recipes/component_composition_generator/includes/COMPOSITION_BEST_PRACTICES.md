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

## Conclusion

Component composition is a powerful pattern for building complex UIs from simpler parts. By following these best practices, you can create maintainable, testable, and flexible component structures that scale with your application's needs.

Remember that good composition starts with good component design - each component should have a clear purpose and interface. With thoughtful composition, your component library can become a powerful toolkit for building consistent, high-quality user interfaces.