# Library Integration Best Practices

This document outlines best practices for integrating third-party libraries with your application components. Following these guidelines will help create maintainable, flexible integrations that minimize technical debt and maximize development efficiency.

## Core Principles

### 1. Separation of Concerns

- Isolate third-party library code from core component logic
- Create adapters that translate between your domain and library concepts
- Never allow library-specific types or patterns to leak into core components
- Implement clear boundaries between your code and library code

### 2. Abstraction Over Implementation

- Create abstractions that can work with different library implementations
- Define interfaces based on your application needs, not library features
- Isolate library-specific code in dedicated modules
- Make it possible to swap libraries without changing application code

### 3. Dependency Injection

- Use dependency injection to provide library instances to components
- Avoid direct imports of libraries in component code
- Create factories or providers for library instances
- Use context providers for React applications

### 4. Minimal Surface Area

- Integrate only the features you need, not the entire library
- Create focused adapters for specific functionality
- Avoid "kitchen sink" integrations that expose all library features
- Create purpose-specific hooks or utilities rather than general-purpose wrappers

## Integration Patterns

### 1. Adapter Pattern

The adapter pattern converts the interface of a library into an interface your code expects. This is the primary pattern for library integration.

```typescript
// Library-agnostic interface
interface DataFetcher {
  fetch<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
}

// Axios adapter
class AxiosAdapter implements DataFetcher {
  private axios: AxiosInstance;
  
  constructor(config?: AxiosRequestConfig) {
    this.axios = axios.create(config);
  }
  
  async fetch<T>(url: string): Promise<T> {
    const response = await this.axios.get<T>(url);
    return response.data;
  }
  
  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.axios.post<T>(url, data);
    return response.data;
  }
}
```

### 2. Facade Pattern

The facade pattern provides a simplified interface to a complex library or set of libraries.

```typescript
// Authentication facade over multiple auth providers
class AuthFacade {
  private provider: AuthProvider;
  
  constructor(providerType: 'firebase' | 'auth0' | 'cognito') {
    this.provider = this.createProvider(providerType);
  }
  
  private createProvider(type: string): AuthProvider {
    switch(type) {
      case 'firebase': return new FirebaseAuthProvider();
      case 'auth0': return new Auth0Provider();
      case 'cognito': return new CognitoProvider();
      default: throw new Error(`Unsupported provider: ${type}`);
    }
  }
  
  async login(email: string, password: string): Promise<User> {
    return this.provider.authenticate(email, password);
  }
  
  async logout(): Promise<void> {
    return this.provider.signOut();
  }
  
  getCurrentUser(): User | null {
    return this.provider.getUser();
  }
}
```

### 3. Strategy Pattern

The strategy pattern encapsulates alternative implementations (strategies) and makes them interchangeable.

```typescript
// Different storage strategies
interface StorageStrategy {
  get(key: string): any;
  set(key: string, value: any): void;
  remove(key: string): void;
}

class LocalStorageStrategy implements StorageStrategy {
  get(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

class IndexedDBStrategy implements StorageStrategy {
  // Implementation using IndexedDB
}
```

### 4. Provider Pattern (React)

The provider pattern uses React Context to make library functionality available throughout the component tree.

```tsx
// Create context for a UI library
const UILibraryContext = React.createContext<UILibraryAPI | null>(null);

// Provider component
export const UILibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize the library
  const [lib] = React.useState(() => initializeUILibrary());
  
  return (
    <UILibraryContext.Provider value={lib}>
      {children}
    </UILibraryContext.Provider>
  );
};

// Hook for components to use
export function useUILibrary() {
  const context = React.useContext(UILibraryContext);
  if (!context) {
    throw new Error('useUILibrary must be used within a UILibraryProvider');
  }
  return context;
}
```

### 5. Custom Hooks (React)

Create custom hooks that encapsulate library functionality and provide a cleaner interface.

```tsx
// Raw library usage
function ComponentWithRawLibrary() {
  React.useEffect(() => {
    const dropdown = new ComplexLibrary.Dropdown('#dropdown');
    dropdown.init({ /* complex config */ });
    
    return () => dropdown.destroy();
  }, []);
  
  return <div id="dropdown">...</div>;
}

// With custom hook
function useDropdown(ref, options) {
  React.useEffect(() => {
    if (!ref.current) return;
    
    const dropdown = new ComplexLibrary.Dropdown(ref.current);
    dropdown.init(options);
    
    return () => dropdown.destroy();
  }, [ref, options]);
}

function ComponentWithHook() {
  const dropdownRef = React.useRef(null);
  useDropdown(dropdownRef, { /* simple options */ });
  
  return <div ref={dropdownRef}>...</div>;
}
```

## Common Integration Types

### 1. UI Component Libraries

When integrating UI libraries like Material UI, Chakra UI, or Ant Design:

- Create adapter components that match your design system
- Standardize props across different UI libraries
- Isolate styling and theming configuration
- Consider accessibility requirements across libraries

```tsx
// Adapter for buttons from different UI libraries
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'text';
  size: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

// Using Material UI
function MaterialButton({ variant, size, ...props }: ButtonProps) {
  // Map your variants to Material variants
  const materialVariant = {
    primary: 'contained',
    secondary: 'outlined',
    text: 'text'
  }[variant];
  
  // Map your sizes to Material sizes
  const materialSize = {
    small: 'small',
    medium: 'medium',
    large: 'large'
  }[size];
  
  return <MuiButton variant={materialVariant} size={materialSize} {...props} />;
}

// Using Chakra UI
function ChakraButton({ variant, size, ...props }: ButtonProps) {
  // Map your variants to Chakra variants
  const chakraVariant = {
    primary: 'solid',
    secondary: 'outline',
    text: 'ghost'
  }[variant];
  
  // Map your sizes to Chakra sizes
  const chakraSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg'
  }[size];
  
  return <ChakraBtn variant={chakraVariant} size={chakraSize} {...props} />;
}
```

### 2. State Management Libraries

When integrating Redux, MobX, Zustand, or other state management libraries:

- Create domain-specific hooks or selectors
- Isolate store configuration and setup
- Abstract away library-specific concepts
- Provide simple, focused APIs for components

```tsx
// Redux integration without leaking Redux concepts
// store.ts - This is where Redux is initialized
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks.ts - Application-specific hooks that hide Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { login, logout, updateProfile } from './userSlice';

// Use throughout the app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector<RootState, T>(selector);

// Domain-specific hooks that abstract away Redux
export function useUser() {
  const user = useAppSelector(state => state.user.data);
  const isLoading = useAppSelector(state => state.user.loading);
  const error = useAppSelector(state => state.user.error);
  const dispatch = useAppDispatch();
  
  return {
    user,
    isLoading,
    error,
    login: (credentials) => dispatch(login(credentials)),
    logout: () => dispatch(logout()),
    updateProfile: (data) => dispatch(updateProfile(data))
  };
}
```

### 3. API/Data Fetching Libraries

When integrating Axios, React Query, SWR, or other data fetching libraries:

- Create service modules that encapsulate API calls
- Use consistent error handling patterns
- Abstract away library-specific configurations
- Provide typed responses and parameters

```tsx
// API client with Axios that doesn't expose Axios directly
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors, handle tokens, etc.
apiClient.interceptors.request.use(/* ... */);
apiClient.interceptors.response.use(/* ... */);

// Generic API service that hides Axios implementation details
export async function get<T>(url: string, params?: any): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get(url, { params });
  return response.data;
}

export async function post<T>(url: string, data: any): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post(url, data);
  return response.data;
}

// React Query integration with custom hooks
import { useQuery, useMutation } from 'react-query';
import * as api from './api';

export function useUsers() {
  return useQuery('users', () => api.get<User[]>('/users'));
}

export function useUser(id: string) {
  return useQuery(['user', id], () => api.get<User>(`/users/${id}`));
}

export function useUpdateUser() {
  return useMutation((user: User) => api.post(`/users/${user.id}`, user));
}
```

### 4. Form Libraries

When integrating Formik, React Hook Form, or other form libraries:

- Create form components that hide library details
- Standardize validation patterns
- Implement consistent error handling
- Abstract away library-specific field components

```tsx
// Form hook that abstracts React Hook Form
import { useForm as useReactHookForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export function useForm<T extends Record<string, any>>(
  schema: yup.ObjectSchema<any>,
  defaultValues?: Partial<T>
) {
  const form = useReactHookForm<T>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  
  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    reset: form.reset,
    setValue: form.setValue,
    watch: form.watch,
  };
}

// Abstract form field component
interface FieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
}

export function Field({ name, label, type = 'text', required }: FieldProps) {
  const { register, errors } = useFormContext();
  const error = errors[name]?.message;
  
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        aria-invalid={!!error}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
```

## Implementation Strategies

### 1. Prepare for Migration

When integrating a library with the possibility of migrating to a different one later:

- Identify core functionality needed from the library
- Create an interface that captures this functionality
- Implement an adapter for the current library
- Document assumptions and constraints for potential future adapters

### 2. Progressive Integration

When integrating complex libraries:

- Start with the minimal integration needed for the current use case
- Implement one feature at a time
- Test thoroughly before moving to the next feature
- Document library usage patterns for future reference

### 3. Configuration Management

For libraries with complex configuration:

- Centralize configuration in a dedicated module
- Provide sensible defaults with override options
- Document configuration options and impacts
- Consider environment-specific configurations

```typescript
// Centralized configuration for a charting library
export const chartDefaults = {
  theme: 'light',
  animations: true,
  responsiveAnimationDuration: 500,
  legend: {
    position: 'top',
    align: 'center',
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
};

export function createChartConfig(overrides = {}) {
  return deepMerge(chartDefaults, overrides);
}

// Usage
const config = createChartConfig({
  animations: false,
  legend: {
    position: 'bottom',
  },
});
```

### 4. Testing Library Integrations

Strategies for testing library integrations:

- Mock the third-party library in unit tests
- Create test-specific adapters for integration tests
- Use contract tests to verify adapter behavior
- Include example usage in documentation

```typescript
// Mocking a library in tests
jest.mock('third-party-library', () => ({
  initialize: jest.fn(),
  Widget: jest.fn().mockImplementation(() => ({
    render: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
  })),
}));

// Testing an adapter
describe('ThirdPartyAdapter', () => {
  it('should convert application data to library format', () => {
    const adapter = new ThirdPartyAdapter();
    const appData = { name: 'Test', value: 42 };
    const libraryData = adapter.toLibraryFormat(appData);
    
    expect(libraryData).toEqual({
      label: 'Test',
      data: 42,
    });
  });
  
  it('should convert library responses to application format', () => {
    const adapter = new ThirdPartyAdapter();
    const libraryResponse = { result: { label: 'Test', data: 42 } };
    const appData = adapter.fromLibraryResponse(libraryResponse);
    
    expect(appData).toEqual({
      name: 'Test',
      value: 42,
    });
  });
});
```

## Common Pitfalls to Avoid

### 1. Library Lock-in

- **Problem**: Tightly coupling application code to library-specific patterns
- **Solution**: Create abstractions that hide library details and allow for future replacement

### 2. Direct Library Imports

- **Problem**: Importing library modules directly in component code
- **Solution**: Use dependency injection, context providers, or custom hooks to access library functionality

### 3. Inconsistent Integration Patterns

- **Problem**: Different integration patterns across the application
- **Solution**: Establish and document standard patterns for each type of library integration

### 4. Excessive Functionality Exposure

- **Problem**: Exposing all library functionality rather than what's needed
- **Solution**: Create focused adapters that expose only the functionality your application needs

### 5. Missing Documentation

- **Problem**: Inadequate documentation of library integration and usage patterns
- **Solution**: Document how each library is integrated, how to use the integration, and any constraints or assumptions

## Library-Specific Best Practices

### React Libraries

- Use context providers for global library instances
- Create custom hooks for accessing library functionality
- Wrap library components with your own components
- Handle cleanup in useEffect return functions

### Python Libraries

#### Python General Integration Patterns

- Create abstract base classes or protocols for integration points
- Use dependency injection for providing library implementations
- Implement factory functions or classes for creating library instances
- Use appropriate context managers for resource management

```python
# Abstract interface for integration
from abc import ABC, abstractmethod

class StorageBackend(ABC):
    @abstractmethod
    def store(self, key: str, data: Any) -> bool:
        """Store data by key."""
        pass
        
    @abstractmethod
    def retrieve(self, key: str) -> Any:
        """Retrieve data by key."""
        pass
        
# Library-specific implementation
class RedisBackend(StorageBackend):
    def __init__(self, redis_client):
        self.client = redis_client
        
    def store(self, key: str, data: Any) -> bool:
        serialized = json.dumps(data)
        return self.client.set(key, serialized)
        
    def retrieve(self, key: str) -> Any:
        serialized = self.client.get(key)
        if serialized:
            return json.loads(serialized)
        return None
```

#### ORM and Database Libraries

- Isolate database models from business logic
- Create repository classes to encapsulate ORM operations
- Use connection pooling and manage connections properly
- Implement proper transaction handling

```python
# Repository pattern for database access
class UserRepository:
    def __init__(self, db_session):
        self.session = db_session
        
    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.session.query(User).filter(User.id == user_id).first()
        
    def create(self, user_data: dict) -> User:
        user = User(**user_data)
        self.session.add(user)
        self.session.commit()
        return user
        
    def update(self, user_id: int, user_data: dict) -> Optional[User]:
        user = self.get_by_id(user_id)
        if not user:
            return None
            
        for key, value in user_data.items():
            setattr(user, key, value)
            
        self.session.commit()
        return user
```

#### HTTP and API Client Libraries

- Create service classes for API interactions
- Implement consistent error handling and retry logic
- Centralize request/response transformation
- Handle authentication and session management

```python
# API client that abstracts away requests library
class ApiClient:
    def __init__(self, base_url, auth_token=None):
        self.base_url = base_url
        self.session = requests.Session()
        if auth_token:
            self.session.headers.update({"Authorization": f"Bearer {auth_token}"})
        
    def get(self, endpoint, params=None):
        try:
            response = self.session.get(f"{self.base_url}/{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise ApiError(f"GET request failed: {str(e)}")
            
    def post(self, endpoint, data):
        try:
            response = self.session.post(f"{self.base_url}/{endpoint}", json=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise ApiError(f"POST request failed: {str(e)}")
```

#### Async Libraries

- Create asynchronous facades for sync libraries when needed
- Properly manage async resources with context managers
- Use consistent patterns for async code
- Consider backpressure and error handling

```python
# Async wrapper for a synchronous library
class AsyncCache:
    def __init__(self, sync_cache):
        self.cache = sync_cache
        
    async def get(self, key: str) -> Any:
        return await asyncio.to_thread(self.cache.get, key)
        
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        if ttl:
            return await asyncio.to_thread(self.cache.set, key, value, ttl)
        return await asyncio.to_thread(self.cache.set, key, value)
```

#### Configuration and Settings Libraries

- Create a unified configuration interface
- Support multiple configuration sources
- Implement validation for configuration values
- Provide sensible defaults

```python
# Configuration management with Pydantic
from pydantic import BaseSettings, Field

class DatabaseSettings(BaseSettings):
    host: str = Field(default="localhost")
    port: int = Field(default=5432)
    username: str
    password: str
    database: str
    pool_size: int = Field(default=5)
    
    class Config:
        env_prefix = "DB_"
        
class AppSettings(BaseSettings):
    debug: bool = Field(default=False)
    log_level: str = Field(default="INFO")
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    
    class Config:
        env_nested_delimiter = "__"
```

### Data Fetching Libraries

- Centralize API endpoint definitions
- Create service modules for related API calls
- Implement consistent error handling
- Cache results appropriately

### UI Component Libraries

- Create a design system layer above the UI library
- Map your design system concepts to library components
- Handle responsive design consistently
- Ensure accessibility across all components

### State Management Libraries

- Define clear boundaries for what goes in global state
- Create selectors or computed values for derived state
- Implement consistent action patterns
- Document state shape and usage

## Examples

### Good Integration Example: UI Library

```tsx
// Good UI library integration with adapter components and theming
// theme.ts - Centralized theme configuration
export const theme = {
  colors: {
    primary: '#0070f3',
    secondary: '#ff4081',
    error: '#f44336',
    background: '#ffffff',
    text: '#333333',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
  },
};

// MuiThemeProvider.tsx - Adapter for Material UI theming
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { theme } from './theme';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.primary,
    },
    secondary: {
      main: theme.colors.secondary,
    },
    error: {
      main: theme.colors.error,
    },
    background: {
      default: theme.colors.background,
    },
    text: {
      primary: theme.colors.text,
    },
  },
  spacing: (factor) => `${factor * 8}px`,
});

export function MuiThemeProvider({ children }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

// Button.tsx - Adapter component for Material UI Button
import { Button as MuiButton } from '@mui/material';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  ...props
}: ButtonProps) {
  // Map app variants to MUI variants
  const muiVariant = {
    primary: 'contained',
    secondary: 'outlined',
    text: 'text',
  }[variant];
  
  // Map app sizes to MUI sizes
  const muiSize = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  }[size];
  
  return <MuiButton variant={muiVariant} size={muiSize} {...props} />;
}
```

### Poor Integration Example: UI Library

```tsx
// Poor integration that leaks library details throughout the app
// Direct usage of Material UI components without abstraction
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme
} from '@mui/material';

// Inconsistent theme usage across the application
const theme = createTheme({
  // Theme configuration duplicated in multiple places
});

function MyComponent() {
  // Direct usage of library components with library-specific props
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Button variant="contained" color="primary">Submit</Button>
        <TextField label="Username" variant="outlined" />
        <FormControl variant="outlined">
          <InputLabel>Age</InputLabel>
          <Select>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
          </Select>
        </FormControl>
      </div>
    </ThemeProvider>
  );
}
```

## Conclusion

Effective library integration requires thoughtful separation of concerns, clear abstractions, and consistent patterns. By following these best practices, you can create maintainable integrations that enhance your application without creating tight coupling to specific libraries.

Remember that the goal of library integration is to leverage external functionality while maintaining your application's conceptual integrity and architectural boundaries. Well-designed integrations allow you to take advantage of powerful libraries without becoming dependent on them.