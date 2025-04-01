# Dependency Management Best Practices

This document outlines best practices for managing dependencies in software projects, ensuring security, performance, and maintainability.

## Core Principles

### 1. Minimal Dependencies

- Add dependencies only when they provide substantial value
- Prefer small, focused libraries over large frameworks when possible
- Regularly audit dependencies to remove unused ones
- Consider the full dependency tree, not just direct dependencies

### 2. Version Specification

- **Production dependencies**: Use fixed versions (`1.2.3`) or caret ranges (`^1.2.3`) for predictable builds
- **Development dependencies**: Can be more flexible with version ranges
- Always include a lock file (package-lock.json, yarn.lock, pnpm-lock.yaml) in version control
- Document any specific version requirements and reasons

### 3. Security Considerations

- Regularly scan dependencies for vulnerabilities (npm audit, Snyk, etc.)
- Avoid dependencies with known security issues
- Prefer well-maintained libraries with active communities
- Consider the reputation and track record of dependency authors/maintainers

### 4. Organization and Structure

- Clearly separate production and development dependencies
- Group related dependencies together in documentation
- Document the purpose of each non-obvious dependency
- Consider organizing dependencies by feature area for large projects

## Package.json Best Practices

### 1. Essential Fields

- Include meaningful name, version, description, and license
- Set appropriate `private: true` for non-published packages
- Define `engines` field to specify Node.js version requirements
- Include `repository` field with correct URL

### 2. Scripts

- Define common scripts: `start`, `build`, `test`, `lint`
- Create consistent naming conventions across projects
- Add documentation for non-standard scripts
- Consider script composition rather than duplication

### 3. Dependencies vs DevDependencies

**Dependencies**:
- Runtime requirements needed in production
- Core libraries and frameworks
- Utility libraries used in the runtime code

**DevDependencies**:
- Build tools (webpack, vite, esbuild)
- Test frameworks (jest, mocha)
- Linters and formatters (eslint, prettier)
- Type definitions (@types/*)
- Development utilities

### 4. Optional Dependencies

- Use `optionalDependencies` for truly optional features
- Ensure code gracefully handles missing optional dependencies
- Document when and why optional dependencies are needed

### 5. Peer Dependencies

- Use for plugins or extensions to other libraries
- Clearly document version compatibility requirements
- Test against multiple versions of peer dependencies

## Configuration File Best Practices

### 1. TypeScript (tsconfig.json)

- Set appropriate target based on browser/environment support
- Configure strict type checking for better code quality
- Define sensible module resolution strategy
- Organize and document path aliases

### 2. Build Tools

**Webpack/Vite/Rollup**:
- Optimize for development experience and production performance
- Configure appropriate source maps
- Set up code splitting where beneficial
- Implement tree shaking for smaller bundles

### 3. Linting and Formatting

**ESLint/Prettier**:
- Establish consistent rules across projects
- Consider extending standard configurations
- Document any rule customizations and reasons
- Integrate with CI/CD to enforce standards

### 4. Testing Configuration

- Configure appropriate test environments
- Set up code coverage thresholds
- Configure mocking behavior
- Establish patterns for test data and fixtures

## Language-Specific Considerations

### JavaScript/TypeScript Projects

- Consider a monorepo structure for related packages
- Use workspaces for managing internal dependencies
- Set up proper path aliases for clean imports
- Configure appropriate module systems (ESM vs CommonJS)

### Python Projects

#### Modern Python Dependency Management

- Use `pyproject.toml` as the primary configuration file (PEP 621)
- Prefer uv for dependency management and virtual environments
  - Fast installation and resolution
  - Compatible with pip and existing workflows
  - Consistent lockfile generation (uv.lock)
- Define appropriate dependency groups:
  - Required runtime dependencies
  - Development dependencies (testing, linting)
  - Optional feature dependencies
- Use `requirements.txt` only for simpler projects or compatibility

#### Python Version Management

- Specify Python version requirements explicitly
- Use appropriate version specifiers:
  - `>=3.9,<3.12` for compatible version ranges
  - `~=3.10.0` for minor version compatibility
  - `==3.11.5` for exact version requirements
- Consider maintaining compatibility with multiple Python versions

#### Configuration Files

- **pyproject.toml**: Package metadata, build system, dependencies
- **ruff.toml**: Modern Python linting configuration (replaces flake8, isort)
- **mypy.ini** or **pyproject.toml [tool.mypy]**: Type checking configuration
- **pytest.ini** or **pyproject.toml [tool.pytest]**: Test configuration

### Java/Kotlin Projects

- Use Maven or Gradle for dependency management
- Follow semantic versioning conventions
- Organize dependencies by scope
- Consider BOM (Bill of Materials) for version coordination

## Dependency Maintenance

### 1. Regular Updates

- Schedule regular dependency updates
- Automate updates with tools like Dependabot or Renovate
- Group similar updates together
- Have a strategy for major version upgrades

### 2. Versioning Policy

- Follow Semantic Versioning (SemVer) for your own packages
- Communicate breaking changes clearly
- Maintain change logs to document dependency changes
- Test thoroughly before upgrading major versions

### 3. Troubleshooting Dependencies

- Establish a process for resolving dependency conflicts
- Document workarounds for known issues
- Consider forking problematic dependencies when necessary
- Contribute fixes back to dependency projects when possible

## Implementation Examples

### Good Example: Minimal React Setup

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.4",
    "vite": "^4.3.9",
    "@vitejs/plugin-react": "^4.0.0",
    "vitest": "^0.32.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### Bad Example: Bloated Setup

```json
{
  "name": "bloated-app",
  "dependencies": {
    "react": "*",
    "react-dom": "*",
    "lodash": "*",
    "moment": "*",
    "jquery": "*",
    "bootstrap": "*",
    "express": "*",
    "axios": "*"
  },
  "devDependencies": {
    "webpack": "*",
    "babel": "*"
  }
}
```

## Remember

- Dependencies represent technical debt
- Choose dependencies thoughtfully
- Maintain them actively
- Document your decisions
- Test thoroughly when updating

This guide serves as a reference for making informed decisions about dependency management across your projects.