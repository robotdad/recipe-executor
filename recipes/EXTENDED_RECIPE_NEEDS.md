# Extended Recipe Types for Complex Component Generation

This document outlines the need for additional recipe types and enhancements to support more complex component generation, particularly for UI components with multiple dependencies and subcomponents.

## New Recipe Types

### 1. DependencySetupRecipe

**Purpose:** Generate and configure build infrastructure files (package.json, tsconfig.json, etc.)

**Key Features:**
- Generate appropriate package.json with required dependencies
- Create language-specific configuration files (tsconfig.json, vite.config.js, etc.)
- Set up build scripts and commands
- Configure linting and formatting preferences

**Integration with Existing Recipes:**
- Used by the codebase generator after component code generation
- Could be triggered automatically based on language selection
- Should integrate with component_blueprint_generator to receive dependency information

**Example Implementation:**
```json
{
  "steps": [
    {
      "type": "read_file",
      "path": "{{project_recipe_path}}/specs/dependencies.md",
      "artifact": "dependency_spec"
    },
    {
      "type": "generate",
      "prompt": "Generate package configuration files based on the following requirements:\n\nDependency Specifications:\n{{dependency_spec}}\n\nLanguage: {{language}}\nComponent Type: {{component_type}}\n\nCreate the following configuration files:\n1. package.json with all required dependencies\n2. {{language}}-specific configuration files\n3. Build system configuration\n\nEnsure all dependencies are appropriate versions and properly categorized (dependencies vs devDependencies).",
      "model": "{{model|default:'azure:o3-mini'}}",
      "artifact": "config_files"
    },
    {
      "type": "write_file",
      "artifact": "config_files",
      "root": "{{output_root}}/{{target_project}}/config"
    }
  ]
}
```

**Required README:** Should include sample prompts for different languages, demonstrate how dependency lists are processed, and show validation examples.

### 2. ComponentCompositionRecipe

**Purpose:** Integrate multiple subcomponents into a cohesive whole

**Key Features:**
- Generate glue code between subcomponents
- Create proper import/export structure
- Establish component API that leverages subcomponents
- Manage TypeScript interfaces and types across components

**Integration with Existing Recipes:**
- Run after all subcomponent generation is complete
- Takes output from multiple codebase generator runs
- Provides final integration layer

**Example Implementation:**
```json
{
  "steps": [
    {
      "type": "read_file",
      "path": "{{project_recipe_path}}/specs/integration.md",
      "artifact": "integration_spec"
    },
    {
      "type": "read_file",
      "path": "{{output_root}}/subcomponents_manifest.json",
      "artifact": "subcomponents"
    },
    {
      "type": "generate",
      "prompt": "Generate integration code to combine multiple subcomponents into a cohesive component:\n\nIntegration Specification:\n{{integration_spec}}\n\nSubcomponents:\n{{subcomponents}}\n\nLanguage: {{language}}\n\nCreate the main component that properly imports and uses all subcomponents according to the specification.",
      "model": "{{model|default:'azure:o3-mini'}}",
      "artifact": "integration_code"
    },
    {
      "type": "write_file",
      "artifact": "integration_code",
      "root": "{{output_root}}/{{target_project}}/{{component_id}}"
    }
  ]
}
```

**Required README:** Should include examples of integration patterns between components, ways to handle state sharing, and approaches for different component architectures.

### 3. TestGenerationRecipe

**Purpose:** Create appropriate tests for components

**Key Features:**
- Generate unit tests for components
- Create integration tests for composite components
- Support multiple testing frameworks (Jest, React Testing Library, etc.)
- Generate test configuration

**Integration with Existing Recipes:**
- Run after component generation
- Uses component specification to derive test cases
- Creates test files alongside component files

**Example Implementation:**
```json
{
  "steps": [
    {
      "type": "read_file",
      "path": "{{project_recipe_path}}/specs/{{component_id}}.md",
      "artifact": "spec"
    },
    {
      "type": "read_file",
      "path": "{{output_root}}/{{target_project}}/{{component_id}}/index.tsx",
      "artifact": "component_code"
    },
    {
      "type": "generate",
      "prompt": "Generate component tests based on the following information:\n\nComponent Specification:\n{{spec}}\n\nComponent Code:\n{{component_code}}\n\nLanguage: {{language}}\nTesting Framework: {{testing_framework|default:'jest'}}\n\nCreate appropriate unit tests that verify:\n1. Basic rendering without errors\n2. All props are respected\n3. Component behavior matches specification\n4. Error states are handled correctly",
      "model": "{{model|default:'azure:o3-mini'}}",
      "artifact": "test_files"
    },
    {
      "type": "write_file",
      "artifact": "test_files",
      "root": "{{output_root}}/{{target_project}}/{{component_id}}/__tests__"
    }
  ]
}
```

**Required README:** Should include examples for different testing frameworks, approaches for testing different component types, and validation techniques.

### 4. LibraryIntegrationRecipe

**Purpose:** Handle specific third-party library integrations

**Key Features:**
- Generate adapter code for specific libraries
- Configure library initialization
- Create hook wrappers and utility functions
- Handle library-specific patterns and requirements

**Integration with Existing Recipes:**
- Run after core component generation
- Takes core component as input
- Produces library integration code

**Example Implementation:**
```json
{
  "steps": [
    {
      "type": "read_file",
      "path": "{{project_recipe_path}}/specs/library_integration.md",
      "artifact": "library_spec"
    },
    {
      "type": "read_file",
      "path": "{{output_root}}/{{target_project}}/{{component_id}}/core/index.tsx",
      "artifact": "core_component"
    },
    {
      "type": "generate",
      "prompt": "Generate library integration code based on the following information:\n\nLibrary Integration Requirements:\n{{library_spec}}\n\nCore Component:\n{{core_component}}\n\nLanguage: {{language}}\nTarget Library: {{target_library}}\n\nCreate adapter code that connects the core component to the specified library, following best practices for that library's integration.",
      "model": "{{model|default:'azure:o3-mini'}}",
      "artifact": "adapter_code"
    },
    {
      "type": "write_file",
      "artifact": "adapter_code",
      "root": "{{output_root}}/{{target_project}}/{{component_id}}/adapters"
    }
  ]
}
```

**Required README:** Should include examples for common libraries, integration patterns, and validation steps for different frameworks.

## Recipe Enhancements

### 1. Improved Language Awareness

**Current Limitations:**
- Templates are often biased toward Python
- TypeScript/JavaScript/React support is limited
- Language-specific idioms not fully utilized

**Proposed Enhancements:**
- More extensive conditional logic in templates based on language
- Language-specific template variants
- Better handling of JSX/TSX in code generation
- Support for language-specific file structures

### 2. Multi-file Component Support

**Current Limitations:**
- Focused on single-file components
- Limited support for directory structures
- No management of import/export relationships

**Proposed Enhancements:**
- Support for generating component directories
- Automatic handling of imports between related files
- Index file generation for exports
- Type sharing between files

### 3. Project Configuration

**Current Limitations:**
- Limited support for project-level configuration
- No generation of build configuration
- Dependency management not included

**Proposed Enhancements:**
- Project-level recipe that configures build environment
- Generation of package.json with proper dependencies
- Support for different build systems (Vite, webpack, etc.)
- Configuration file generation (tsconfig.json, etc.)

## Integration with Blueprint and Codebase Generators

### Blueprint Generator Enhancements

1. **Enhanced Context Passing:**
   - Add support for component type (UI component, service, utility, etc.)
   - Include library dependencies in context
   - Pass subcomponent relationships

2. **Multi-component Blueprint Support:**
   - Generate related blueprints for subcomponents
   - Create manifest of related components
   - Establish relationships between components

3. **Language-specific Templates:**
   - Create separate templates for different languages
   - Support common patterns in each language
   - Better handling of UI component patterns

### Codebase Generator Enhancements

1. **Multi-stage Generation:**
   - Support for generating components in stages
   - Dependencies between generation steps
   - Composition of generated components

2. **Improved File Management:**
   - Support for generating directory structures
   - Better handling of related files
   - Management of imports/exports

3. **Integration Support:**
   - Generation of integration code between components
   - Support for common composition patterns
   - Library-specific integration code

## Required Documentation and Validation

All new recipe types should include:

1. **Comprehensive README:**
   - Purpose and use cases
   - Required parameters and context
   - Example usage
   - Integration with other recipes

2. **Sample Templates:**
   - Starting points for different use cases
   - Language-specific variants
   - Common patterns and idioms

3. **Validation Examples:**
   - Simple test cases
   - Expected outputs
   - Verification steps

4. **Integration Documentation:**
   - How to combine with other recipes
   - Order of operations
   - Context passing

By implementing these new recipe types and enhancements, the system will be better equipped to handle complex component generation, particularly for UI components with multiple subcomponents and external dependencies.