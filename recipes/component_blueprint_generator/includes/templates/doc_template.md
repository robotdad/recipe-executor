# {{component_name}} Component Usage

## Importing

{% if language == 'typescript' or language == 'javascript' %}
```typescript
import { {{component_name}} } from '{{module_path|default:"components/"+component_id}}';
```
{% else %}
```python
from {{module_path|default:component_id}} import {{component_name}}
```
{% endif %}

## Initialization

[Description of initialization]

{% if language == 'typescript' or language == 'javascript' %}
```typescript
// Example initialization
const {{component_id}} = new {{component_name}}(options);
```

{% if component_type == 'react' %}
```tsx
// React component usage
<{{component_name}} 
  prop1={value1}
  prop2={value2}
/>
```
{% endif %}
{% else %}
```python
# Example initialization
{{component_id}} = {{component_name}}()
```
{% endif %}

## Core API

### [Method/Function 1]

{% if language == 'typescript' or language == 'javascript' %}
```typescript
function methodName(param1: Type1, param2: Type2): ReturnType {
  // [Method description]
}
```
{% else %}
```python
def method_name(param1: Type1, param2: Type2) -> ReturnType:
    """
    [Method description]

    Args:
        param1: [Parameter description]
        param2: [Parameter description]

    Returns:
        [Return value description]

    Raises:
        [Exception]: [Exception description]
    """
```
{% endif %}

Example:

{% if language == 'typescript' or language == 'javascript' %}
```typescript
// Usage example
```
{% else %}
```python
# Usage example
```
{% endif %}

### [Method/Function 2]

...

## Integration with Other Components

[Description of how this component interacts with others]

{% if language == 'typescript' or language == 'javascript' %}
```typescript
// Integration example
```
{% else %}
```python
# Integration example
```
{% endif %}

## Important Notes

1. [Important note 1]
2. [Important note 2]
3. ...