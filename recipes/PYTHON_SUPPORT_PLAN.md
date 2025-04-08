# Plan to Enhance Recipe Generators for Python Support

This document outlines the plan to enhance the recipe generators to support Python as well as they currently support TypeScript/JavaScript.

## Overview

While our recipe generators have a foundation for multi-language support, they currently favor TypeScript/JavaScript in their examples, templates, and best practices. This plan details the enhancements needed to provide equal support for Python development, making the system more versatile for different project types.

## 1. Dependency Setup Generator

### Current Status
- Optimized for JavaScript/TypeScript (package.json, tsconfig.json)
- Lacks specific Python dependency management support

### Enhancements Needed
1. **Python Dependency File Templates**:
   - Add templates for pyproject.toml with uv configuration
   - Support for uv.lock file generation
   - Include fallback support for requirements.txt and setup.py

2. **Python Configuration Templates**:
   - Add templates for ruff.toml (replacing .flake8), mypy.ini, pytest.ini
   - Support modern Python tooling configuration

3. **Python Specific Best Practices**:
   - Expand DEPENDENCY_BEST_PRACTICES.md with Python-specific guidance
   - Focus on uv for dependency management and virtual environments
   - Include best practices for pyproject.toml structure and dependency specification

4. **Example Specifications**:
   - Create example Python dependency specifications
   - Include different Python project types (library, application, CLI)

## 2. Test Generator

### Current Status
- Has multi-language capability but examples are JavaScript-focused
- Needs more Python testing patterns and frameworks

### Enhancements Needed
1. **Python Testing Frameworks Support**:
   - Enhance for pytest, unittest, nose
   - Add Python-specific test patterns and fixtures

2. **Python-Specific Test Templates**:
   - Create templates for test_*.py files following Python conventions
   - Support both class-based and function-based test patterns

3. **Python Testing Best Practices**:
   - Expand TESTING_BEST_PRACTICES.md with Python-specific patterns
   - Include patterns for mock, patch, fixture usage

4. **Example Specifications**:
   - Create Python component examples with accompanying tests
   - Include different Python testing scenarios (API, class, function)

## 3. Component Composition Generator

### Current Status
- Primarily focused on TypeScript/React components
- Needs adaptation for Python module composition patterns

### Enhancements Needed
1. **Python Module Composition Patterns**:
   - Add support for Python package structure (__init__.py, etc.)
   - Create templates for Python module composition and imports

2. **Python Interface Definitions**:
   - Support Abstract Base Classes, Protocol classes, type hints
   - Create templates for Python component interfaces

3. **Python-Specific Best Practices**:
   - Expand COMPOSITION_BEST_PRACTICES.md with Python patterns
   - Include Python module/package organization guidance

4. **Example Specifications**:
   - Create Python component integration examples
   - Include examples of composing Python modules and packages

## 4. Library Integration Generator

### Current Status
- Examples and patterns are TypeScript/React focused
- Needs adaptation for Python library integration patterns

### Enhancements Needed
1. **Python Library Adapter Patterns**:
   - Create templates for Python library integration
   - Support for common Python library patterns (decorators, wrappers)

2. **Python-Specific Library Integration**:
   - Add support for common Python libraries (SQLAlchemy, Flask, Django, etc.)
   - Create adapter patterns for Python libraries

3. **Python Library Best Practices**:
   - Expand LIBRARY_INTEGRATION_BEST_PRACTICES.md with Python patterns
   - Include guidance specific to Python library ecosystem

4. **Example Specifications**:
   - Create examples for Python library integration
   - Include diverse library types (ORM, web, data science)

## Implementation Plan

### Phase 1: Research and Documentation (1-2 days)
1. Research Python best practices for each recipe domain
2. Update best practices documentation with Python-specific sections
3. Create outlines for Python-specific templates and examples

### Phase 2: Template and Example Development (3-4 days)
1. Create Python-specific templates for each generator
2. Develop example Python component specifications
3. Design Python dependency, testing, composition, and library integration examples

### Phase 3: Recipe Enhancement (3-4 days)
1. Update recipe prompts to better handle Python-specific patterns
2. Enhance the recipe logic to detect language and apply appropriate templates
3. Add conditional logic in recipes for language-specific handling

### Phase 4: Testing and Validation (2-3 days)
1. Test each generator with Python examples
2. Validate output quality and correctness
3. Refine templates and prompts based on testing results

### Phase 5: Documentation and Examples (1-2 days)
1. Document Python support in README files
2. Create detailed usage examples for Python projects
3. Update EXTENDED_RECIPE_TYPES_SUMMARY.md with Python support details

## Starting Points

### 1. Dependency Setup Generator
- Create a Python dependency spec example using uv:
  ```
  /recipes/dependency_setup_generator/examples/python_uv_dependency_spec.md
  ```
- Update the generate_config.json to recognize Python projects with uv
- Add example uv.lock file generation

### 2. Test Generator
- Create a Python component example:
  ```
  /recipes/test_generator/examples/python_component_spec.md
  /recipes/test_generator/examples/example_module.py
  ```
- Update the generate_tests.json to include Python test patterns

### 3. Component Composition Generator
- Create Python module integration examples:
  ```
  /recipes/component_composition_generator/examples/python_integration_spec.md
  /recipes/component_composition_generator/examples/python_modules_manifest.json
  ```
- Update the generate_composition.json for Python package structure

### 4. Library Integration Generator
- Create Python library integration examples:
  ```
  /recipes/library_integration_generator/examples/python_library_integration_spec.md
  /recipes/library_integration_generator/examples/python_core_module.py
  ```
- Update the generate_integration.json for Python library patterns

## Success Metrics

The enhanced recipe generators will be considered successful when:

1. All generators can produce high-quality Python output that follows Python best practices
2. Documentation and examples clearly demonstrate Python usage patterns
3. Best practices documents include equal coverage for Python and TypeScript/JavaScript
4. Users can seamlessly use the generators for both Python and TypeScript/JavaScript projects

## Resources

1. Python project structure best practices:
   - [Python Packaging Authority](https://www.pypa.io/)
   - [Python Packaging User Guide](https://packaging.python.org/en/latest/)

2. Python testing frameworks:
   - [pytest documentation](https://docs.pytest.org/)
   - [unittest documentation](https://docs.python.org/3/library/unittest.html)

3. Python dependency management:
   - [uv documentation](https://github.com/astral-sh/uv)
   - [pip documentation](https://pip.pypa.io/)
   - [PEP 621 - Storing project metadata in pyproject.toml](https://peps.python.org/pep-0621/)

4. Python package organization:
   - [Python Modules and Packages](https://docs.python.org/3/tutorial/modules.html)
   - [Hitchhiker's Guide to Python](https://docs.python-guide.org/writing/structure/)

## Timeline

With dedicated resources, this enhancement plan could be completed in approximately 2-3 weeks:
- Phase 1: 1-2 days
- Phase 2: 3-4 days
- Phase 3: 3-4 days
- Phase 4: 2-3 days
- Phase 5: 1-2 days