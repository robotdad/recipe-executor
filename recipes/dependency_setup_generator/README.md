# Dependency Setup Generator

The Dependency Setup Generator is a specialized recipe system that creates configuration files and dependency setups for software projects based on dependency specifications. It generates appropriate build infrastructure files like package.json, tsconfig.json, and framework-specific configurations.

## Overview

Modern software projects, especially in the JavaScript/TypeScript ecosystem, require proper configuration of dependencies, build tools, and development utilities. This generator creates these configuration files based on a specification, ensuring consistent and optimized dependency management.

## Key Features

1. **Package Configuration Generation**: Creates appropriate package.json with dependencies, scripts, and metadata
2. **Language-specific Configuration**: Generates configuration for TypeScript, Babel, etc.
3. **Build Tool Setup**: Creates configurations for Vite, Webpack, etc.
4. **Linting and Formatting Setup**: Configures ESLint, Prettier, etc.
5. **Testing Framework Configuration**: Sets up Jest, Vitest, etc.
6. **Smart Dependency Organization**: Properly separates production and development dependencies
7. **Version Management**: Uses appropriate version ranges following best practices

## How It Works

1. A dependency specification is provided in markdown format
2. The generator analyzes the spec to understand the project requirements
3. It creates appropriate configuration files based on the language and framework choices
4. All configuration files are written to the specified output directory
5. A summary of generated files is provided

## Usage Instructions

### Basic Usage

To generate configuration files from a dependency specification:

```bash
python recipe_executor/main.py recipes/dependency_setup_generator/generate_config.json \
  --context dependency_spec_path=/path/to/dependency_spec.md \
  --context language=typescript \
  --context output_path=my-project/config \
  --context output_root=output
```

### Parameters

- `dependency_spec_path`: Path to the dependency specification markdown file
- `language`: Programming language for the project (javascript, typescript, python, etc.)
- `output_path`: Directory within output_root where files should be generated
- `output_root`: Base directory for output files (default: "output")
- `model` (optional): LLM model to use (default: "azure:o3-mini")

### Integration with Other Recipes

The Dependency Setup Generator can be used in conjunction with other generators:

1. **With Component Blueprint Generator**: After generating component blueprints, use this recipe to set up the build infrastructure

```bash
# First generate the component blueprint
python recipe_executor/main.py recipes/component_blueprint_generator/build_blueprint.json \
  --context candidate_spec_path=path/to/spec.md \
  --context component_id=my-component \
  --context output_root=output

# Then generate the dependency configuration
python recipe_executor/main.py recipes/dependency_setup_generator/generate_config.json \
  --context dependency_spec_path=output/dependency_spec.md \
  --context language=typescript \
  --context output_path=my-component \
  --context output_root=output
```

2. **With Codebase Generator**: After generating component code, set up dependencies

```bash
# After code generation, set up dependencies
python recipe_executor/main.py recipes/dependency_setup_generator/generate_config.json \
  --context dependency_spec_path=path/to/dependency_spec.md \
  --context language=typescript \
  --context output_path=my-component \
  --context output_root=output
```

## Creating Dependency Specifications

A good dependency specification should include:

1. **Project Information**: Name, description, language, build system
2. **Core Dependencies**: Runtime libraries and frameworks needed in production
3. **Development Dependencies**: Build tools, testing frameworks, and other dev utilities
4. **Configuration Requirements**: Special settings for TypeScript, build tools, etc.
5. **Optional Features**: Additional capabilities that might need specific dependencies

See the [example dependency specification](./examples/dependency_spec.md) for a template.

## Output Files

Depending on the project type, the generator will create:

- **package.json**: Core dependency and script definitions
- **tsconfig.json**: TypeScript configuration (if using TypeScript)
- **vite.config.js/ts**: Vite configuration (if using Vite)
- **webpack.config.js**: Webpack configuration (if using Webpack)
- **.eslintrc.js**: ESLint configuration
- **.prettierrc**: Prettier configuration
- **jest.config.js** or **vitest.config.ts**: Test configuration
- Other framework-specific files as needed

## Best Practices

The generator follows the best practices defined in [DEPENDENCY_BEST_PRACTICES.md](./includes/DEPENDENCY_BEST_PRACTICES.md), including:

- Minimizing dependencies
- Using appropriate version specifiers
- Separating production and development dependencies
- Configuring tools for optimal developer experience
- Setting up proper security practices

## Example

See the [examples directory](./examples/) for a sample dependency specification and the resulting configuration files.

## Extending the Generator

To extend the generator for additional languages or frameworks:

1. Update the prompt in `generate_config.json` with additional language-specific guidance
2. Add examples for the new language in the examples directory
3. Update the documentation to reflect the new capabilities

The generator already supports multiple languages and frameworks through its prompt, but adding specific examples can help improve the quality of generated configurations.