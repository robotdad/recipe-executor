# Library Integration Generator

The Library Integration Generator is a specialized recipe system that creates adapter code to integrate core components with third-party libraries. It generates the necessary connectors, wrappers, and utility functions to provide seamless integration while maintaining clean separation of concerns.

## Overview

Modern applications often need to integrate with third-party libraries for authentication, UI components, state management, data fetching, and more. This generator creates the necessary adapter code to connect your core components with specific libraries while maintaining architectural boundaries.

## Key Features

1. **Adapter Code Generation**: Creates adapter components that connect core functionality with library-specific implementations
2. **Library Initialization**: Generates proper library setup and configuration code
3. **Custom Hooks and Utilities**: Creates wrapper hooks and utility functions for cleaner library usage
4. **Type Definitions**: Generates appropriate types and interfaces for library integration
5. **Clean Separation**: Maintains separation between core components and library-specific code
6. **Documentation**: Generates usage examples showing the integrated components

## How It Works

1. A library integration specification is provided describing how a component should integrate with a specific library
2. Optionally, a core component implementation is provided as reference
3. The generator analyzes both inputs to understand the integration requirements
4. It creates adapter components, hooks, utilities, and configuration files
5. All files are written to the specified output directory

## Usage Instructions

### Basic Usage

To generate library integration code:

```bash
python recipe_executor/main.py recipes/library_integration_generator/integrate_library.json \
  --context library_integration_spec_path=/path/to/integration_spec.md \
  --context core_component_path=/path/to/core_component.tsx \
  --context language=typescript \
  --context output_path=my-component/adapters \
  --context output_root=output
```

### Parameters

- `library_integration_spec_path`: Path to the library integration specification markdown file
- `core_component_path`: (Optional) Path to the core component implementation file
- `language`: Programming language (javascript or typescript)
- `output_path`: Directory within output_root where files should be generated
- `output_root`: Base directory for output files (default: "output")
- `model` (optional): LLM model to use (default: "azure:o3-mini")

### Integration with Other Recipes

The Library Integration Generator can be used in conjunction with other generators:

1. **With Component Blueprint and Codebase Generators**: After generating a core component, create library adapters

```bash
# First generate the core component
python recipe_executor/main.py recipes/component_blueprint_generator/build_blueprint.json \
  --context candidate_spec_path=specs/auth_component.md \
  --context component_id=auth \
  --context output_root=output

python recipe_executor/main.py output/auth/recipes/auth_create.json

# Then generate the library integration code
python recipe_executor/main.py recipes/library_integration_generator/integrate_library.json \
  --context library_integration_spec_path=specs/auth0_integration_spec.md \
  --context core_component_path=output/auth/auth.tsx \
  --context language=typescript \
  --context output_path=auth/adapters/auth0 \
  --context output_root=output
```

## Library Integration Specification Format

The library integration specification is a markdown file that describes:

1. **Overview**: Description of the integration purpose
2. **Core Component Description**: Details about the core component to be integrated
3. **Integration Requirements**: Specific requirements for the library integration
4. **API Design**: Interface definitions and expected APIs
5. **Integration Architecture**: Component relationships and file structure
6. **Usage Examples**: Examples showing how the integrated component should be used
7. **Implementation Notes**: Guidelines and considerations for the implementation

See the [example integration specification](./examples/auth_integration_spec.md) for a template.

## Supported Integration Types

The generator supports multiple types of library integrations:

1. **UI Component Libraries**: Material UI, Chakra UI, Ant Design, etc.
2. **Authentication Libraries**: Auth0, Firebase Auth, AWS Cognito, etc.
3. **State Management**: Redux, MobX, Zustand, Jotai, etc.
4. **Data Fetching**: React Query, SWR, Apollo, etc.
5. **Form Libraries**: Formik, React Hook Form, Final Form, etc.
6. **Styling Libraries**: Styled Components, Emotion, Tailwind, etc.

## Integration Patterns

The generator implements several patterns for clean library integration:

1. **Adapter Pattern**: Converting library interfaces to your application interfaces
2. **Facade Pattern**: Providing a simplified interface to complex libraries
3. **Provider Pattern**: Using context providers to make library instances available
4. **Hook Pattern**: Creating custom hooks that abstract library details
5. **HOC Pattern**: Building higher-order components for library integration

## Output Files

Depending on the integration type, the generator creates:

- **Adapter Components**: Bridge between your components and library components
- **Library Providers**: Context providers for library instances
- **Custom Hooks**: Application-specific hooks wrapping library hooks
- **Configuration Files**: Setup and initialization for libraries
- **Type Definitions**: TypeScript interfaces and types for library integration
- **Utility Functions**: Helper functions for common library operations

## Best Practices

The generator follows best practices defined in [LIBRARY_INTEGRATION_BEST_PRACTICES.md](./includes/LIBRARY_INTEGRATION_BEST_PRACTICES.md), including:

- Separation of concerns
- Abstraction over implementation
- Dependency injection
- Minimal surface area
- Consistent error handling
- Clean interface design

## Example

See the [examples directory](./examples/) for a sample integration specification and core component.

## Extending the Generator

To extend the generator for additional libraries:

1. Update the prompt in `generate_integration.json` with additional library-specific guidance
2. Add examples for the new library in the examples directory
3. Update LIBRARY_INTEGRATION_BEST_PRACTICES.md with relevant guidance
4. Update the documentation to reflect the new capabilities