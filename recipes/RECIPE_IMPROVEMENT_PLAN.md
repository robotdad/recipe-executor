# Recipe Improvement Plan

This document outlines a comprehensive strategy for improving the recipe executor's generation capabilities without modifying the core recipe_executor codebase. The plan addresses key issues identified in our current generation process, particularly around library integration, framework support, and implementation quality.

## Current Issues

1. **Placeholder Implementation**: Components often contain structural placeholders rather than actual functionality
2. **Dependency Management**: Required dependencies aren't properly included in generated package.json
3. **Integration Problems**: Components aren't properly wired together with consistent interfaces
4. **Multiple Library Support**: Current system only supports single library integration per component
5. **Quality of Implementation**: Detailed specifications often result in generic boilerplate

## Improvement Strategy

### 1. Template System for Libraries and Frameworks

Create a structured template directory system:

```
/templates
  /libraries
    /milkdown
      integration.tsx.template
      dependencies.json
      example.tsx
    /mermaid
      integration.tsx.template
      dependencies.json
      example.tsx
    /excalidraw
      integration.tsx.template
      dependencies.json
      example.tsx
    /shiki
      integration.tsx.template
      dependencies.json
      example.tsx
  /frameworks
    /react
      component.tsx.template
      test.tsx.template
      hooks.tsx.template
    /angular
      component.ts.template
      test.spec.ts.template
    /vue
      component.vue.template
      test.spec.ts.template
```

Each template file would contain actual implementation code, not just structural placeholders. The integration templates would include real library imports, initialization, and usage examples.

### 2. Template Discovery and Management

1. **Template Manifest**: Create a JSON manifest file listing all available templates with metadata:

```json
{
  "libraries": [
    {
      "name": "milkdown",
      "display_name": "Milkdown",
      "description": "WYSIWYG Markdown editor framework",
      "dependencies": ["@milkdown/core", "@milkdown/react", "@milkdown/preset-commonmark"],
      "frameworks": ["react", "vue"],
      "template_path": "templates/libraries/milkdown"
    },
    {
      "name": "mermaid",
      "display_name": "Mermaid",
      "description": "Diagram rendering library",
      "dependencies": ["mermaid"],
      "frameworks": ["react", "angular", "vue"],
      "template_path": "templates/libraries/mermaid"
    }
  ],
  "frameworks": [
    {
      "name": "react",
      "display_name": "React",
      "description": "React framework with TypeScript",
      "languages": ["typescript", "javascript"],
      "template_path": "templates/frameworks/react"
    }
  ]
}
```

2. **Template Documentation Generator**: Create a recipe that generates documentation on all available templates

3. **Template Listing Tool**: Build a tool to list available templates for libraries and frameworks

### 3. Multiple Library Integration Support

Enhance the library integration process to support multiple libraries:

1. **Multi-library Parameter**: Allow comma-separated values in `target_library` parameter
   - Example: `--context target_library="mermaid,excalidraw"`

2. **Library Integration Manifest**: Create a structured format for specifying multiple libraries:

```json
{
  "libraries": [
    {
      "name": "mermaid",
      "version": "^9.0.0", 
      "purpose": "Diagram rendering"
    },
    {
      "name": "excalidraw",
      "version": "^0.12.0",
      "purpose": "Interactive drawing"
    }
  ]
}
```

3. **Integration Recipe Enhancement**: Modify the library integration recipe to process multiple libraries

### 4. Dependency Management Improvement

Ensure all required dependencies are properly included:

1. **Dependency Extraction**: Enhance the setup_dependencies recipe to analyze specifications and extract mentioned libraries
   - Parse specification text to identify library mentions
   - Cross-reference with the library manifest to determine required packages

2. **Dependency Mapping**: Create a mapping between libraries and their required dependencies
   ```json
   {
     "milkdown": [
       "@milkdown/core", 
       "@milkdown/react", 
       "@milkdown/preset-commonmark"
     ],
     "shiki": ["shiki"]
   }
   ```

3. **Dependency Resolution**: Ensure development dependencies (types, testing libraries) are also included

### 5. Recipe Enhancement for Better Implementation

1. **Library-specific Prompts**: Enhance generation prompts with library-specific guidance:
   ```
   # Milkdown Integration Guidelines
   - Initialize Milkdown with proper configuration
   - Set up required plugins: commonmark, gfm, math
   - Set up proper editor state management
   - Handle editor events appropriately
   ```

2. **Concrete Implementation Examples**: Include more concrete implementation examples in prompts:
   ```
   # Example Milkdown Integration
   ```jsx
   import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
   import { ReactEditor, useEditor } from '@milkdown/react';
   import { commonmark } from '@milkdown/preset-commonmark';
   
   export const MilkdownEditor = () => {
     const { editor } = useEditor((root) => {
       return Editor.make()
         .config((ctx) => {
           ctx.set(rootCtx, root);
           ctx.set(defaultValueCtx, '# Hello Milkdown');
         })
         .use(commonmark)
         .create();
     });
   
     return <div className="editor">{editor}</div>;
   };
   ```
   ```

3. **Quality Checks**: Add verification steps in prompts to ensure:
   - Actual library initialization is implemented
   - Consistent naming conventions are followed
   - Import paths match the project structure
   - Main application properly integrates all components

### 6. Implementation Plan

#### Phase 1: Template System Development (2 weeks)
- Create the template directory structure
- Develop initial templates for key libraries (Milkdown, Mermaid, Excalidraw, Shiki)
- Create templates for React components with TypeScript

#### Phase 2: Template Integration with Recipes (2 weeks)
- Enhance prompts to use templates for concrete implementation
- Create template discovery and listing tools
- Implement multi-library support in integration recipes

#### Phase 3: Dependency Management Improvement (1 week)
- Create library-to-dependency mappings
- Enhance dependency extraction from specifications
- Implement dependency resolution logic

#### Phase 4: Testing and Refinement (1 week)
- Test with complex components requiring multiple libraries
- Refine templates based on output quality
- Document the new template system and processes

## Reflection and Improvements

After reviewing the plan, several additional considerations emerge:

### Additional Challenges

1. **Template Maintenance**: As libraries evolve, templates will need regular updates
2. **Balancing Specificity vs. Flexibility**: Very specific templates may be less adaptable to unique requirements
3. **Code Duplication**: Similar code patterns might be repeated across different library templates
4. **Version Compatibility**: Dependencies need version compatibility management

### Enhanced Approach

1. **Template Versioning**: 
   - Associate templates with library version ranges
   - Support multiple versions of the same library template
   - Include version-specific implementation details

2. **Composable Template System**:
   - Break templates into smaller, reusable fragments
   - Create a composition system for assembling templates
   - Allow mixing and matching patterns across libraries

3. **Template Testing**:
   - Create a validation system for templates
   - Include test cases with expected outputs
   - Automated testing of template generation

4. **Smart Prompt Enhancement**:
   - Use embeddings to find relevant code examples
   - Include "templating hints" in specifications
   - Use progressive enhancement with multiple prompts

5. **Specification Analysis**:
   - Add NLP-based analysis of specifications
   - Extract implementation requirements automatically
   - Suggest templates based on spec content

### Template Evolution Strategy

To ensure templates improve over time:

1. **Feedback Loop**: 
   - Capture metrics on generated code quality
   - Collect feedback on template effectiveness
   - Use successful generations to improve templates

2. **Community Contributions**:
   - Enable easy template contributions
   - Create a validation process for new templates
   - Document template creation best practices

3. **Incremental Enhancement**:
   - Start with the most commonly used libraries
   - Focus on high-quality examples first
   - Gradually expand template coverage

## Compatibility with recipe_executor

It's important to ensure our improvements don't interfere with the recipe_executor itself, which primarily uses Python. Based on analysis of the recipe_executor codebase, here are key considerations:

### Current Library Handling in recipe_executor

The recipe_executor handles libraries using:

1. **Try/Except Import Pattern**: Libraries are imported with try/except blocks to handle missing dependencies gracefully
2. **Conditional Imports**: Libraries are imported only when needed
3. **Standard Dependencies**: Core dependencies are declared in pyproject.toml
4. **No Integration Templates**: Python libraries don't use integration templates like we're planning for JS/TS

### Potential Interference Points

1. **Language-Specific Prompts**: Any changes to `codebase_generator/generate_code.json` must maintain proper language conditionals (`{% if language == 'typescript' or language == 'javascript' %}`) to ensure Python generation continues working correctly
   
2. **Template Variables**: Ensure backward compatibility with recipe_executor's usage of template variables and variable handling

3. **Core Recipe Logic**: Don't alter the core functionality of recipe execution process

4. **Future Python Support**: We'll need to extend our template system to handle Python libraries in the future

### Safeguards

1. **Language Conditional Testing**: Test all prompt changes to ensure Python generation still works

2. **Recipe Structure Validation**: Validate that recipe structures remain compatible

3. **Python Template Planning**: Begin planning Python library templates for future enhancement

## Conclusion

This improvement plan addresses the core issues in our current generation process without modifying the recipe_executor itself. By enhancing our templates, improving library integration, and providing more concrete implementation examples, we can dramatically improve the quality of generated code from detailed specifications.

The plan maintains language and framework flexibility while providing much better support for complex library integrations, particularly for React/TypeScript applications that require multiple third-party libraries. The template system's composability and versioning strategy will ensure it remains maintainable and adaptable as libraries evolve.

The most immediate priority should be developing high-quality templates for the libraries required by the Markdown Editor (Milkdown, Mermaid, Excalidraw, Shiki) and enhancing the dependency management system to ensure all required packages are properly included in the generated application. In parallel, we should ensure all changes maintain compatibility with Python generation for recipe_executor.