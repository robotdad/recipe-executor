# Python Dependency Specification

## Project Information

- **Project Name**: recipe-executor
- **Description**: A system for executing AI-powered code generation recipes
- **Language**: Python
- **Minimum Python Version**: 3.9
- **Repository URL**: https://github.com/example/recipe-executor

## Core Dependencies

### Runtime Requirements

- **pydantic>=2.4.0**: For data validation and settings management
- **openai>=1.0.0**: Client for OpenAI API integration
- **anthropic~=0.5.0**: Client for Anthropic API integration
- **httpx>=0.24.1**: Asynchronous HTTP client for API requests
- **rich>=13.4.2**: Enhanced terminal output and formatting
- **jinja2>=3.1.2**: Template processing for code generation
- **pyyaml>=6.0.0**: YAML parsing and generation

## Development Dependencies

### Testing

- **pytest>=7.3.1**: Testing framework
- **pytest-cov>=4.1.0**: Test coverage reporting
- **pytest-asyncio>=0.21.0**: Testing async code

### Linting and Type Checking

- **ruff>=0.0.272**: Python linter and formatter
- **mypy>=1.3.0**: Static type checking

### Development Tools

- **pre-commit>=3.3.2**: Git pre-commit hooks
- **uv>=0.1.0**: Modern Python package installer and resolver

## Configuration Requirements

### Build System

- Use `pyproject.toml` with modern configuration
- Configure uv as the primary package management tool
- Add support for setuptools as fallback

### Linting Configuration

- Configure ruff with appropriate rules:
  - Enable import sorting
  - Enforce code style (similar to black)
  - Use line length of 100
  - Enable Python type checking validation

### Type Checking

- Enable strict mypy type checking
- Configure proper handling of imports

### Testing Configuration

- Use pytest with enhanced output
- Enable coverage reporting
- Configure test discovery patterns

## Additional Considerations

- Include support for both development and production environments
- Create example command documentation for common tasks
- Add convenience scripts for common operations
- Ensure proper handling of optional dependencies
- Configuration should be compatible with common CI/CD systems