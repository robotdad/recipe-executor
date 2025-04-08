### Working with Components

#### Building Specific Components

You can work on individual components rather than rebuilding entire systems:

1. **Component-specific recipes**: Use `<component_name>_create.json` or `<component_name>_edit.json` to build or modify a single component
   ```bash
   python recipe_executor/main.py recipes/recipe_executor/recipes/context_create.json
   ```

2. **Component collections**: Build related component groups using folder-level recipes
   ```bash
   python recipe_executor/main.py recipes/recipe_executor/recipes/steps/create.json
   ```

3. **Dependency awareness**: When building a component, consider what other components might depend on it

#### Creating vs. Editing

Recipe Executor provides two main workflows for component development:

- **Create recipes** (`<component>_create.json`): Generate components from scratch
- **Edit recipes** (`<component>_edit.json`): Modify existing components while preserving structure

As your specs improve, the difference between create and edit results becomes minimal.

### Effective Recipe Development

To get the most out of Recipe Executor:

1. **Right-size your tasks**: Break down complex tasks into smaller, more reliable pieces
   - "Breaking it down to smaller asks makes a big difference"
   - LLMs perform more reliably with focused, clear instructions

2. **Provide the right context**: Include only what's needed for a specific task
   - Too little context: Model may miss important details
   - Too much context: Model may get distracted or confused

3. **Iterative recipe development**:
   - Start with a working manual workflow
   - Capture that workflow in a recipe
   - Use it as long as it's useful
   - Refine or discard as needed

4. **Focus on testing output, not inspecting code**:
   - Treat generated code as a means to an end
   - Validate functionality, not implementation details
   - If it works, move on; if not, update specs