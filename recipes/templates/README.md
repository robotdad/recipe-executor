# Recipe Executor Templates

This directory contains templates for various libraries, frameworks, and languages to be used with the recipe executor's code generation system.

## Directory Structure

```
/templates
  /libraries           # Library-specific integration templates
    /milkdown          # Milkdown Markdown editor integration
    /mermaid           # Mermaid diagram rendering integration
    /excalidraw        # Excalidraw drawing tool integration
    /shiki             # Shiki syntax highlighting integration
  /frameworks          # Framework-specific templates
    /react             # React component templates
    /angular           # Angular component templates
    /vue               # Vue component templates
  /languages           # Language-specific templates
    /python            # Python templates
    /typescript        # TypeScript templates
  /combinations        # Multi-library combinations
    /mermaid_excalidraw # Combined Mermaid + Excalidraw integration
  manifest.json        # Template discovery manifest
```

## Template Types

### Library Templates

Library templates provide integration code for specific libraries. Each library template includes:

- `integration.{ext}.template`: Main integration code template
- `dependencies.json`: Required dependencies with version information
- `example.{ext}`: Example usage of the integration

### Framework Templates

Framework templates provide component structure for specific UI frameworks. Each framework template includes:

- `component.{ext}.template`: Main component template
- `test.{ext}.template`: Test file template
- Additional framework-specific files

### Language Templates

Language templates provide language-specific patterns. Each language template includes:

- Basic code structure templates
- Testing templates
- Configuration templates

### Combination Templates

Combination templates handle integration of multiple libraries together.

## Usage

The templates are used by the recipe executor's code generation process. Templates use the Liquid template language for variable substitution and conditional logic.

### Variables

Common template variables include:

- `componentName`: Name of the component (PascalCase)
- `componentId`: ID of the component (snake_case)
- `language`: Programming language
- Various component-specific variables

### Template Files

Template files use the `.template` extension with the appropriate language extension prefix (e.g., `.tsx.template`, `.py.template`).

## Adding New Templates

To add a new template:

1. Create a directory for your template in the appropriate category
2. Add the necessary template files
3. Update the `manifest.json` file with your template information

## Template Discovery

The `manifest.json` file contains metadata about all available templates, including:

- Template names and descriptions
- File paths
- Language and framework compatibility
- Version information

## Examples

Example files demonstrate how to use the generated code in a real application. They provide concrete usage patterns that can be easily adapted to specific needs.