# Test Generator

The Test Generator is a specialized recipe system that creates comprehensive tests for software components based on specifications and component code. It generates appropriate test files, configuration, and test cases for effective validation of components.

## Overview

Effective testing is critical for maintaining software quality. This generator creates thorough test suites tailored to specific components, languages, and testing frameworks, ensuring consistent testing practices and adequate coverage.

## Key Features

1. **Comprehensive Test Coverage**: Generates tests for basic functionality, edge cases, and error conditions
2. **Framework-specific Tests**: Creates tests for specific testing frameworks (Jest, Vitest, pytest, etc.)
3. **Component Type Awareness**: Generates appropriate tests based on component type (UI, API, utility, etc.)
4. **Testing Best Practices**: Follows established testing patterns and practices
5. **Complete Test Environment**: Creates not just test cases but also configuration and helper files
6. **Multiple Test Types**: Creates unit tests, integration tests, and other appropriate test types
7. **Mocks and Fixtures**: Generates necessary mocks, fixtures, and test data

## How It Works

1. A component specification and optionally the component code are provided
2. The generator analyzes the spec and code to understand the requirements and implementation
3. It creates appropriate test files based on the language and testing framework
4. All test files are written to the specified output directory
5. The tests follow best practices defined in the TESTING_BEST_PRACTICES documentation

## Usage Instructions

### Basic Usage

To generate tests for a component:

```bash
python recipe_executor/main.py recipes/test_generator/setup_tests.json \
  --context component_spec_path=/path/to/component_spec.md \
  --context component_code_path=/path/to/component.js \
  --context language=javascript \
  --context testing_framework=jest \
  --context output_path=my-component/__tests__ \
  --context output_root=output
```

### Parameters

- `component_spec_path`: Path to the component specification markdown file
- `component_code_path`: (Optional) Path to the component implementation file
- `language`: Programming language of the component (javascript, typescript, python, etc.)
- `testing_framework`: Testing framework to use (jest, vitest, pytest, etc.)
- `output_path`: Directory within output_root where test files should be generated
- `output_root`: Base directory for output files (default: "output")
- `model` (optional): LLM model to use (default: "azure:o3-mini")

### Integration with Other Recipes

The Test Generator can be used in conjunction with other generators:

1. **With Component Blueprint Generator and Codebase Generator**: After generating component blueprints and code, use this recipe to set up tests

```bash
# First generate the component blueprint
python recipe_executor/main.py recipes/component_blueprint_generator/build_blueprint.json \
  --context candidate_spec_path=path/to/spec.md \
  --context component_id=my-component \
  --context output_root=output

# Then generate the component code
python recipe_executor/main.py output/my-project/recipes/my-component_create.json

# Finally generate the tests
python recipe_executor/main.py recipes/test_generator/setup_tests.json \
  --context component_spec_path=output/my-project/specs/my-component.md \
  --context component_code_path=output/my-project/my-component/index.js \
  --context language=javascript \
  --context testing_framework=jest \
  --context output_path=my-project/my-component/__tests__ \
  --context output_root=output
```

## Supported Testing Frameworks

### JavaScript/TypeScript
- Jest
- Vitest
- Mocha
- React Testing Library
- Vue Testing Library
- Cypress

### Python
- pytest
- unittest
- Nose

### Java/Kotlin
- JUnit
- TestNG
- Mockito

## Output Files

Depending on the component and testing framework, the generator creates:

- **Test Files**: Main test files containing test cases
- **Configuration**: Testing framework configuration files
- **Mocks**: Mock data and services for isolated testing
- **Fixtures**: Test fixtures and helpers
- **Setup Files**: Test environment setup code

## Test Patterns

The generator creates tests following these patterns:

1. **Unit Tests**: Testing individual functions and methods
2. **Component Tests**: Testing UI components (rendering, interactions, props)
3. **Integration Tests**: Testing integration between components
4. **Edge Case Tests**: Testing boundary conditions and special cases
5. **Error Handling Tests**: Testing error conditions and recovery

## Best Practices

The generator follows the best practices defined in [TESTING_BEST_PRACTICES.md](./includes/TESTING_BEST_PRACTICES.md), including:

- Arrange-Act-Assert pattern for test structure
- Clear and descriptive test names
- Proper isolation between tests
- Appropriate mocking of dependencies
- Focus on behavior over implementation details

## Example

See the [examples directory](./examples/) for a sample component specification and the resulting tests.

## Extending the Generator

To extend the generator for additional languages or testing frameworks:

1. Update the prompt in `generate_tests.json` with additional framework-specific guidance
2. Add examples for the new framework in the examples directory
3. Update TESTING_BEST_PRACTICES.md with relevant guidance
4. Update the documentation to reflect the new capabilities