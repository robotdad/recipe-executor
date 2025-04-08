# Blueprint-Based Project Creation Guide

This guide walks you through the complete workflow for creating a new project using Recipe Executor's blueprint-first approach.

## Overview

The Recipe Executor system includes tools for creating complete software projects through a systematic, blueprint-based approach:

1. Write high-level project specifications
2. Validate and refine specifications with AI assistance
3. Generate detailed component blueprints
4. Generate code from blueprints
5. Iterate and refine

## Prerequisites

1. Recipe Executor environment setup:
   ```bash
   # Clone the repository (if you haven't already)
   git clone [repository-url]
   cd recipe-executor

   # Install dependencies
   make install

   # Activate virtual environment
   source .venv/bin/activate
   ```

   This guide presumes recipe-executor is a peer directory to your project folder.

2. API keys for LLM providers configured in `.env` file

## Project Structure

Create a new project with this recommended structure:

```
my-project/
├── ai_context/         # AI context files (copied from recipe-executor)
│   ├── PROJECT.md      # Your project overview
│   └── ...             # Other context files
├── specs/              # High-level specifications
│   └── project_spec.md # Main project specification
├── blueprint/          # Generated blueprint files
│   ├── components/     # Component-specific files
│   └── create.json     # Main creation recipe
└── output/             # Generated code
```

## Complete Workflow

### 1. Set Up Project Directory

```bash
mkdir my-project
cd my-project
mkdir -p ai_context specs blueprint output recipes
```

### 2. Copy Required AI Context Files

Copy these files from Recipe Executor's `ai_context/` to your `ai_context/` directory:
[MODULAR_DESIGN_PHILOSOPHY.md](../ai_context/MODULAR_DESIGN_PHILOSOPHY.md)
[IMPLEMENTATION_PHILOSOPHY.md](../ai_context/IMPLEMENTATION_PHILOSOPHY.md)
[COMPONENT_DOCS_SPEC_GUIDE.md](../ai_context/COMPONENT_DOCS_SPEC_GUIDE.md)

or Python projects
ai_context/PYDANTIC_AI_DOCS.md
ai_context/dev_guides/DEV_GUIDE_FOR_PYTHON.md

### 3. Create Project Specification

Create a file at `specs/project_spec.md` with this structure:

```markdown
# Project Specification

## Overview
[High-level description of the project]

## Components
- [Component 1]: [Brief description]
- [Component 2]: [Brief description]
...

## Component Details

### [Component 1]
- Purpose: [What this component does]
- Responsibilities: [Key responsibilities]
- Interfaces: [Input/output contracts]
- Dependencies: [Other components it relies on]

### [Component 2]
...

## Technical Requirements
- [Language/framework requirements]
- [Performance constraints]
- [Security requirements]
...

## Implementation Notes
[Any specific implementation guidance]
```

Alternatively, if you're not sure how to structure your project into components, you can use the project analysis utility:

```bash
# Create a basic project description
echo "# My Project Description\n\nThis project will..." > specs/project_idea.md

# Run the project analysis utility
python ../recipe-executor/recipe_executor/main.py recipes/utilities/project_split_analysis.json --context input=specs/project_idea.md --context output_root=specs
```

This will generate a detailed component breakdown in `specs/project_component_breakdown_analysis.md`.

### 4. Generate Component Specifications

If you've created a project breakdown but need to split it into individual component specifications, use:

```bash
python ../recipe-executor/recipe_executor/main.py recipes/utilities/split_to_components.json --context input=specs/project_component_breakdown_analysis.md --context output_root=specs/components
```

This creates individual component specification files in `specs/components/`.

### 5. Validate Specifications

Run the blueprint CLI to evaluate your specification and get improvement suggestions:

```bash
# Make sure you're in your Recipe Executor environment
source ../recipe-executor/.venv/bin/activate

# Evaluate the specification
python ../recipe-executor/tools/blueprint_cli/cli.py evaluate specs/project_spec.md
```

The tool will:
- Score your specification on completeness
- Generate clarification questions for improvement
- Help refine the specification until it's ready for blueprint generation

Iteratively improve your specification based on the feedback.

### 6. Generate Blueprint

Once your specification is validated, generate the blueprint:

```bash
python ../recipe-executor/tools/blueprint_cli/cli.py generate specs/project_spec.md --output blueprint/
```

This creates:
- Component specifications
- Component documentation
- Recipe files for code generation
- Dependency management structures

### 7. Review Blueprint

Review the generated blueprint files to ensure:
- Component boundaries are appropriate
- Dependencies are correctly identified
- Specifications capture all requirements

### 8. Generate Code

Execute the blueprint recipes to generate code:

```bash
python ../recipe-executor/recipe_executor/main.py blueprint/create.json
```

### 9. Review and Iterate

- Review generated code in the `output/` directory
- Refine component specifications if needed
- Re-run specific component recipes for targeted updates

## Iteration Process for Changes

When you need to make changes to your generated project, follow this blueprint-first approach:

### For Minor Changes to Existing Components

1. **Edit the Component Specification**:
   - Locate the component's specification file in `blueprint/components/[component]/[component]_spec.md`
   - Make your changes to the specification
   - **Do not** directly edit the generated code in `output/`

2. **Run the Component's Edit Recipe**:
   ```bash
   python ../recipe-executor/recipe_executor/main.py blueprint/components/[component]/[component]_edit.json
   ```
   This will make targeted changes to just that component.

### For Significant Architecture Changes

1. **Update Your Original Specification**:
   - Edit `specs/project_spec.md` with your new requirements

2. **Regenerate the Blueprint**:
   ```bash
   python ../recipe-executor/tools/blueprint_cli/cli.py generate specs/project_spec.md --output blueprint-updated/
   ```

3. **Review the New Blueprint**:
   - Compare with your existing blueprint
   - Merge changes as needed

4. **Generate Updated Code**:
   ```bash
   python ../recipe-executor/recipe_executor/main.py blueprint-updated/create.json
   ```

> **Important**: The blueprint-first approach means always changing specifications first, then regenerating code, rather than directly modifying the generated code. This maintains consistency between your specifications and implementation.

### Advanced: Direct Recipe Creation

For experienced users who understand Recipe Executor deeply, you can skip the blueprint generation step:

1. **Create Recipes Directly**:
   - Create your own recipe JSON files directly in your project's `recipes/` directory
   - Define the necessary read, generate, and write steps

2. **Execute Your Recipes**:
   ```bash
   python ../recipe-executor/recipe_executor/main.py recipes/my_custom_recipe.json
   ```

This approach offers more flexibility but requires more manual work and deeper understanding of the Recipe Executor system. For most users, the blueprint-based workflow provides better structure and maintainability.

## Custom Recipes and Workflow Extensions

### Adding Your Own Recipes

You can create your own recipes for project-specific tasks and extend the blueprint-generated workflow:

1. **When to Create Your Own Recipes:**
   - For specialized code generation not covered by the blueprint
   - For utility tasks specific to your project (linting, testing, deployment)
   - For post-processing generated code
   - For integration tasks between components

2. **Creating a Recipe File:**
   Save this as `recipes/custom_task.json` in your project:
   ```json
   {
     "steps": [
       {
         "type": "read_files",
         "path": "specs/custom_requirement.md",
         "artifact": "requirement"
       },
       {
         "type": "generate_llm",
         "prompt": "Generate utilities for: {{requirement}}",
         "model": "azure:gpt-4-turbo",
         "artifact": "utility_code"
       },
       {
         "type": "write_files",
         "artifact": "utility_code",
         "root": "output/utils"
       }
     ]
   }
   ```

3. **Running Your Custom Recipe:**
   ```bash
   # Make sure you're in your Recipe Executor environment
   source ../recipe-executor/.venv/bin/activate

   # Execute your custom recipe
   python ../recipe-executor/recipe_executor/main.py recipes/custom_task.json
   ```

4. **Integrating with Blueprint-Generated Recipes:**
   You can modify the main blueprint recipe to include your custom recipe:

   Edit `blueprint/create.json` to add:
   ```json
   {
     "type": "execute_recipe",
     "recipe_path": "../recipes/custom_task.json"
   }
   ```

   Note: Use relative paths that work when the recipe is executed from the `blueprint/` directory.

5. **Project Organization:**
   ```
   my-project/
   ├── recipes/                   # Your custom recipes
   │   ├── custom_task1.json
   │   └── custom_task2.json
   ├── blueprint/                 # Generated blueprint files
   │   └── create.json            # Main creation recipe
   ├── specs/                     # Specifications
   └── output/                    # Generated code
   ```

## Tips for Success

1. **Detailed Specifications**: The more detailed your initial specification, the better the generated code
2. **Component Granularity**: Aim for components that have a single responsibility
3. **Clear Dependencies**: Explicitly state dependencies between components
4. **Iterative Refinement**: Use the specification validation tools to iteratively improve specifications
5. **Human Review**: Always review blueprint files before code generation

## Troubleshooting

- **Low Specification Score**: Add more detail to your specifications
- **Unclear Components**: Refine component boundaries and responsibilities
- **Dependency Issues**: Ensure dependencies are explicitly stated in specifications
- **Generation Errors**: Check API keys and environment variables

## Next Steps

Once you've generated your initial project:

1. Run and test the generated code
2. Make manual adjustments for edge cases
3. Use component-specific edit recipes for targeted updates
4. Consider version controlling both specifications and generated code