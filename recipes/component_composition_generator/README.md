# Component Composition Generator

The Component Composition Generator is a specialized recipe system that creates integration code to compose multiple subcomponents into a cohesive, unified component. It generates the necessary glue code, type definitions, and export structures to create a seamless integration.

## Overview

Modern applications often use a component-based architecture where complex functionality is broken down into smaller, focused subcomponents. This generator addresses the challenge of integrating these separate pieces into a well-structured, cohesive component that presents a clean API to consumers.

## Key Features

1. **Integration Code Generation**: Creates the necessary code to integrate multiple subcomponents
2. **Type Definitions**: Generates shared interfaces and types for component communication
3. **Export Structure**: Creates a clean, well-organized export structure
4. **Component Communication**: Implements appropriate patterns for inter-component communication
5. **State Management**: Sets up proper state sharing between components
6. **Documentation**: Generates usage examples showing the integrated component

## How It Works

1. An integration specification is provided describing how components should fit together
2. A subcomponents manifest is provided listing all subcomponents to be integrated
3. The generator analyzes both inputs to understand the integration requirements
4. It creates the necessary integration code, types, and exports
5. All files are written to the specified output directory

## Usage Instructions

### Basic Usage

To generate integration code for a set of subcomponents:

```bash
python recipe_executor/main.py recipes/component_composition_generator/compose_components.json \
  --context integration_spec_path=/path/to/integration_spec.md \
  --context subcomponents_manifest_path=/path/to/subcomponents_manifest.json \
  --context language=typescript \
  --context output_path=my-component \
  --context output_root=output
```

### Parameters

- `integration_spec_path`: Path to the integration specification markdown file
- `subcomponents_manifest_path`: Path to the JSON file describing the subcomponents
- `language`: Programming language (javascript or typescript)
- `output_path`: Directory within output_root where files should be generated
- `output_root`: Base directory for output files (default: "output")
- `model` (optional): LLM model to use (default: "azure:o3-mini")

### Integration with Other Recipes

The Component Composition Generator can be used in conjunction with other generators:

1. **With Blueprint and Codebase Generators**: After generating individual components, compose them together

```bash
# First generate and implement individual components
python recipe_executor/main.py recipes/component_blueprint_generator/build_blueprint.json \
  --context candidate_spec_path=specs/field_component.md \
  --context component_id=field \
  --context output_root=output

python recipe_executor/main.py output/form_system/recipes/field_create.json

# Repeat for other subcomponents...

# Then compose the components together
python recipe_executor/main.py recipes/component_composition_generator/compose_components.json \
  --context integration_spec_path=specs/form_integration_spec.md \
  --context subcomponents_manifest_path=manifest/form_subcomponents.json \
  --context language=typescript \
  --context output_path=form_system \
  --context output_root=output
```

## Integration Specification Format

The integration specification is a markdown file that describes:

1. **Overview**: Description of the composite component
2. **Components to Integrate**: List of subcomponents to be composed
3. **Integration Requirements**: Architecture, data flow, and API design
4. **Usage Examples**: Examples showing how the integrated component should be used
5. **Additional Information**: Performance, accessibility, and error handling considerations

See the [example integration specification](./examples/form_integration_spec.md) for a template.

## Subcomponents Manifest Format

The subcomponents manifest is a JSON file that describes each subcomponent:

1. **Name**: The name of the subcomponent
2. **Path**: The file path to the subcomponent implementation
3. **Description**: A brief description of the subcomponent
4. **Dependencies**: Other subcomponents it depends on
5. **Exports**: What the subcomponent exports
6. **API**: The component's props, hooks, and other interface details

See the [example subcomponents manifest](./examples/form_subcomponents_manifest.json) for a template.

## Composition Patterns

The generator supports multiple composition patterns:

1. **Context-based Composition**: Using React Context for state sharing
2. **Prop Drilling**: Passing props down the component tree
3. **Compound Components**: Creating related components that work together
4. **Higher-Order Components**: Wrapping components to add functionality
5. **Custom Hooks**: Sharing logic between components with hooks

The pattern used depends on the requirements specified in the integration spec.

## Output Files

The generator creates several types of files:

- **Main Component**: The primary entry point that composes subcomponents
- **Type Definitions**: Shared interfaces and types
- **Integration Utilities**: Helper functions for component communication
- **Index Files**: Export structure for the component
- **README/Documentation**: Usage examples and API documentation

## Best Practices

The generator follows best practices defined in [COMPOSITION_BEST_PRACTICES.md](./includes/COMPOSITION_BEST_PRACTICES.md), including:

- Clean separation of concerns
- Consistent prop and component naming
- Well-defined interfaces
- Proper state management
- Efficient rendering patterns

## Example

See the [examples directory](./examples/) for a sample integration specification and subcomponents manifest.

## Extending the Generator

To extend the generator for additional composition patterns:

1. Update the prompt in `generate_composition.json` with additional pattern guidance
2. Add examples for the new patterns in the examples directory
3. Update COMPOSITION_BEST_PRACTICES.md with relevant guidance
4. Update the documentation to reflect the new capabilities