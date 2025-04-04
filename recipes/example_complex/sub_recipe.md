# Sub-Recipe: Utility Module Generation

This sub-recipe generates a Python utility module based on additional requirements.

```json
[
  {
    "type": "read_file",
    "path": "recipes/example_complex/specs/sub_spec.txt",
    "artifact": "sub_spec"
  },
  {
    "type": "generate",
    "prompt": "Based on the following sub-specification:\n\n{sub_spec}\n\nGenerate a Python utility module that defines a function called get_logger (which returns a configured logger) and another function process_data(data) that simply returns data unchanged. Return a JSON object with 'files' (a list of file objects with 'path' and 'content') and 'commentary'.",
    "artifact": "generated_util",
    "model": "openai:o3-mini"
  },
  {
    "type": "write_file",
    "artifact": "generated_util",
    "root": "output/utility_module"
  }
]
```
