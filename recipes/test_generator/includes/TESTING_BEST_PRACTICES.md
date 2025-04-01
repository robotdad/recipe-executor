# Software Testing Best Practices

This document outlines best practices for creating effective test suites for software components across different languages and frameworks.

## Core Testing Principles

### 1. Test Pyramid

Maintain a balanced test pyramid with:
- **Unit Tests**: Many small, focused tests of individual functions and components
- **Integration Tests**: Moderate number of tests verifying components work together
- **End-to-End Tests**: Fewer comprehensive tests of complete user flows

### 2. Test Independence

- Each test should be completely independent of others
- Tests should be able to run in any order
- No shared state or dependencies between tests
- Use fresh setup and teardown for each test

### 3. Deterministic Tests

- Tests should always produce the same results when run repeatedly
- Avoid dependencies on external services when possible
- Mock external dependencies consistently
- Avoid reliance on timing or random values

### 4. Readability and Maintainability

- Test names should clearly describe what is being tested
- Follow a consistent naming convention (e.g., "should_doSomething_when_someCondition")
- Structure tests using Arrange-Act-Assert or Given-When-Then patterns
- Keep test code as clean and maintainable as production code

## Language-Specific Testing Guidelines

### JavaScript/TypeScript

#### React Component Testing

- Use React Testing Library for component testing
- Test behavior rather than implementation details
- Find elements by accessible roles or text rather than test IDs when possible
- Test user interactions using fireEvent or userEvent
- Verify rendered output and state changes

```javascript
// Good example:
test('should display error message when form is submitted with empty fields', async () => {
  // Arrange
  render(<LoginForm onSubmit={mockSubmit} />);
  
  // Act
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  // Assert
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  expect(mockSubmit).not.toHaveBeenCalled();
});
```

#### Jest Configuration

- Configure Jest to collect coverage information
- Set up appropriate transforms for TypeScript/JSX
- Use snapshotSerializers for cleaner snapshots
- Configure setupFilesAfterEnv for global test setup

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Python

#### Python Testing Frameworks

- **pytest**: Modern, feature-rich testing framework (recommended)
  - Simple syntax for writing tests
  - Powerful fixture system
  - Extensive plugin ecosystem
  - Excellent failure reporting
- **unittest**: Standard library testing framework
  - Class-based approach
  - JUnit style assertions
  - Built into Python
- **nose2**: Extended unittest framework (less common now)

#### pytest Best Practices

##### Test Structure and Organization

- Organize tests in a `tests` directory or `test_*.py` files
- Name test functions with prefix `test_`
- Group related tests in classes with prefix `Test`
- Organize test files to mirror your project structure
- Use meaningful names that describe the behavior being tested

```python
# Good example of test organization
def test_user_creation_succeeds_with_valid_data():
    # Test logic here
    
def test_user_creation_fails_with_invalid_email():
    # Test logic here
```

##### Fixtures and Setup

- Use fixtures for common setup and teardown
- Create modular fixtures that can be composed
- Use scope appropriately (function, class, module, session)
- Parameterize fixtures for shared setup with variations

```python
# Good fixture example
@pytest.fixture
def authenticated_client():
    """Create an authenticated API client for testing."""
    client = APIClient()
    user = User.objects.create_user(username="testuser", password="password")
    client.login(username="testuser", password="password")
    return client

# Using the fixture
def test_protected_endpoint(authenticated_client):
    response = authenticated_client.get("/api/protected/")
    assert response.status_code == 200
```

##### Test Parameterization

- Use `@pytest.mark.parametrize` for data-driven tests
- Group related test cases together
- Provide descriptive ids for parameters
- Consider using custom data classes for complex inputs

```python
# Parameterized test example
@pytest.mark.parametrize("email,expected", [
    ("valid@email.com", True),
    ("invalid-email", False),
    ("", False),
    ("very.long.email+with-tag@example.co.uk", True)
], ids=["valid", "invalid-format", "empty", "complex"])
def test_email_validation(email, expected):
    # Arrange
    validator = EmailValidator()
    
    # Act
    result = validator.is_valid(email)
    
    # Assert
    assert result == expected
```

##### Mocking and Patching

- Use `unittest.mock` or `pytest-mock` for mocking
- Prefer context manager approach with `with patch():`
- Mock at the lowest level necessary
- Verify mock calls with `assert_called_with()` and similar methods
- Use `autospec=True` to ensure interface compliance

```python
# Good mocking example
def test_user_notification_on_registration():
    # Arrange
    user = User(email="new@example.com")
    
    # Act
    with patch("app.services.email.send_email") as mock_send:
        user.register()
    
    # Assert
    mock_send.assert_called_once_with(
        to="new@example.com", 
        subject="Welcome to our service",
        template="welcome_email.html"
    )
```

##### Assertions and Verification

- Use plain `assert` statements with descriptive messages
- For complex cases, use pytest's built-in assertion introspection
- Use pytest plugins for specialized assertions (API, async, etc.)
- Handle expected exceptions with `pytest.raises`

```python
# Good assertion examples
def test_calculation_result():
    calculator = Calculator()
    result = calculator.add(2, 3)
    assert result == 5, f"Expected 2+3=5, got {result}"
    
def test_invalid_input_raises_error():
    validator = InputValidator()
    with pytest.raises(ValidationError) as excinfo:
        validator.validate("invalid-input")
    assert "Invalid format" in str(excinfo.value)
```

#### Testing Python-Specific Patterns

##### Testing Async Code

- Use `pytest-asyncio` for testing async functions
- Mark tests with `@pytest.mark.asyncio`
- Create async fixtures when needed
- Handle asyncio event loop properly

```python
# Testing async code
@pytest.mark.asyncio
async def test_async_data_fetch():
    service = DataService()
    data = await service.fetch_data()
    assert len(data) > 0
    assert "key" in data
```

##### Testing Flask/Django Applications

- Use `pytest-flask` or `pytest-django` for web framework testing
- Create fixtures for clients, database access, and authentication
- Test views, models, and services separately
- Use proper isolation for database tests

##### Type Checking in Tests

- Consider using type annotations in test code
- Use `mypy` to verify type correctness
- Test edge cases related to types
- Verify overloaded function behavior with different types

##### Testing Database Code

- Use test databases or in-memory databases
- Ensure proper transaction handling and rollbacks
- Use fixtures to set up and clean test data
- Consider using factories for test data generation

```python
# Database test example with cleanup
@pytest.fixture
def test_data():
    # Setup
    user = User.objects.create(username="testuser")
    # Provide the data to the test
    yield user
    # Cleanup
    user.delete()
    
def test_user_profile(test_data):
    profile = Profile.objects.create(user=test_data, bio="Test bio")
    assert profile.user.username == "testuser"
    assert profile.bio == "Test bio"
```

## Component Type-Specific Guidelines

### UI Components

#### Core UI Component Tests

1. **Rendering Tests**:
   - Component renders without errors
   - Component renders with default props
   - Component renders with various prop combinations
   - Component handles null/undefined props correctly

2. **Interaction Tests**:
   - User interactions (click, input, focus, etc.) work as expected
   - Events are fired correctly
   - Callbacks are called with correct parameters

3. **State Management Tests**:
   - Component state changes as expected
   - UI updates reflect state changes
   - Controlled vs. uncontrolled behavior works correctly

4. **Accessibility Tests**:
   - Component is accessible (ARIA attributes, keyboard navigation)
   - Color contrast meets standards
   - Focus management works correctly

### API and Service Tests

#### Core API Tests

1. **Request Handling**:
   - Correct endpoints are called with proper parameters
   - Authentication headers are set properly
   - Query parameters are formatted correctly

2. **Response Handling**:
   - Successful responses are processed correctly
   - Error responses trigger appropriate error handling
   - Edge cases (empty responses, partial data) are handled

3. **Retry and Timeout Behavior**:
   - Services handle network failures gracefully
   - Retry mechanisms work as expected
   - Timeouts are respected

## Test Coverage Guidelines

### What to Cover

- All public methods and functions
- Edge cases and boundary conditions
- Error handling and exception paths
- Complex business logic
- Integration points between components

### Coverage Metrics

- Aim for high line coverage (80%+)
- Focus on branch coverage for complex logic
- Function coverage should approach 100% for public API
- Don't focus solely on metrics - ensure meaningful tests

## Testing Frameworks Guide

### JavaScript/TypeScript

- **Unit Testing**: Jest, Vitest
- **React Components**: React Testing Library, Enzyme
- **Vue Components**: Vue Testing Library, Vue Test Utils
- **Angular Components**: Angular Testing Library, Angular TestBed
- **E2E Testing**: Cypress, Playwright, TestCafe

### Python

- **Unit Testing**: pytest, unittest
- **Web Applications**: pytest-flask, pytest-django
- **API Testing**: requests-mock, responses
- **E2E Testing**: Selenium, pytest-selenium

### Java/Kotlin

- **Unit Testing**: JUnit, TestNG
- **Mocking**: Mockito, PowerMock
- **Spring Applications**: Spring Test
- **E2E Testing**: Selenium

## Mock Data Guidelines

### Principles of Good Mocks

- Mocks should be realistic but minimal
- Create factories for generating test data
- Keep mock data separate from test logic
- Version mock data alongside tests

### Example Mock Setup

```javascript
// Mock factory example
function createUserMock(overrides = {}) {
  return {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  };
}

test('user profile displays correctly', () => {
  const user = createUserMock({ role: 'admin' });
  render(<UserProfile user={user} />);
  expect(screen.getByText('Admin: Test User')).toBeInTheDocument();
});
```

## CI/CD Integration

### Running Tests in CI

- Run all tests on each PR
- Configure appropriate timeouts
- Use test splitting for faster runs
- Save and display test results and coverage

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Common Testing Pitfalls

### Brittle Tests

- Testing implementation details instead of behavior
- Over-reliance on snapshot testing
- Too much mocking
- Hardcoded expectations that change frequently

### Slow Tests

- Too many end-to-end tests
- Inefficient setup/teardown
- External API calls in unit tests
- Unnecessary repetition in test setup

### Incomplete Testing

- Happy path only, no error cases
- Missing edge cases
- Inadequate validation of outputs
- Untested side effects

## Example Test Structures

### Good Unit Test Structure

```javascript
describe('UserService', () => {
  describe('authenticate', () => {
    it('should return user data when credentials are valid', async () => {
      // Arrange
      const mockApi = { post: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }) };
      const service = new UserService(mockApi);
      
      // Act
      const result = await service.authenticate('user', 'pass');
      
      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/auth', { username: 'user', password: 'pass' });
      expect(result).toEqual({ id: '123' });
    });
    
    it('should throw AuthError when credentials are invalid', async () => {
      // Arrange
      const mockApi = { post: jest.fn().mockRejectedValue({ response: { status: 401 } }) };
      const service = new UserService(mockApi);
      
      // Act & Assert
      await expect(service.authenticate('user', 'wrong')).rejects.toThrow(AuthError);
    });
  });
});
```

### Good Integration Test Structure

```javascript
describe('User registration flow', () => {
  beforeEach(() => {
    // Set up database with clean state
    setupTestDatabase();
  });
  
  afterEach(() => {
    // Clean up resources
    cleanupTestDatabase();
  });
  
  it('should register a new user and send welcome email', async () => {
    // Arrange
    const emailService = mockEmailService();
    
    // Act
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'new@example.com',
        password: 'secure123',
        name: 'New User'
      });
    
    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    
    // Verify user was created in database
    const user = await getUserFromDb(response.body.id);
    expect(user).toBeDefined();
    expect(user.email).toBe('new@example.com');
    
    // Verify email was sent
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('new@example.com');
  });
});
```

## Test-Driven Development

### TDD Workflow

1. Write a failing test that describes the feature
2. Run the test to ensure it fails
3. Write the minimal code to make the test pass
4. Run the test to ensure it passes
5. Refactor the code while keeping tests passing
6. Repeat

### Benefits of TDD

- Ensures code is testable by design
- Focuses development on requirements
- Provides rapid feedback
- Creates regression test suite automatically
- Encourages simpler designs

## Conclusion

Testing is an essential part of the software development process. Following these best practices will help ensure your tests are valuable, maintainable, and effective at preventing regressions and validating functionality.

Remember that the goal of testing is not just to achieve high coverage metrics but to provide confidence that your code works as expected and will continue to work as the codebase evolves.