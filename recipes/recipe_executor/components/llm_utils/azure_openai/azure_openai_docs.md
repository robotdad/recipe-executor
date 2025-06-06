# Azure OpenAI Component Usage

## Importing

```python
import recipe_executor.llm_utils.azure_openai
```

## Basic Usage

```python
def get_azure_openai_model(model_name: str, deployment_name: Optional[str] = None, logger: Optional[logging.Logger] = "RecipeExecutor") -> pydantic_ia.models.openai.OpenAIModel:
    """
    Create a PydanticAI OpenAIModel instance, configured from environment variables for Azure OpenAI.

    Args:
        model_name (str): Model name, such as "gpt-4o" or "o3-mini".
        deployment_name (Optional[str]): Deployment name for Azure OpenAI, defaults to model_name.
        logger (Optional[logging.Logger]): Logger instance, defaults to "RecipeExecutor"

    Returns:
        OpenAIModel: A PydanticAI OpenAIModel instance for Azure OpenAI.

    Raises:
        Exception: If the model cannot be created or if the model name is invalid.
    """
```

Usage example:

```python
# Get an OpenAI model using Azure OpenAI
openai_model = azure_openai.get_azure_openai_model("o3-mini")

# Get an OpenAI model using Azure OpenAI with a specific deployment name
openai_model = azure_openai.get_azure_openai_model("o3-mini", "my_deployment_name")
```

## Environment Variables

The component uses environment variables for authentication and configuration. Depending upon the authentication method, set the following environment variables:

### Option 1: Managed Identity with Default Managed Identity

```bash
AZURE_USE_MANAGED_IDENTITY=true # Set to true to use managed identity
AZURE_OPENAI_ENDPOINT= # Required
AZURE_OPENAI_API_VERSION= # Optional, defaults to 2025-03-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME= # Optional, defaults to model_name
```

### Option 2: Managed Identity with Custom Client ID

```bash
AZURE_USE_MANAGED_IDENTITY=true # Set to true to use managed identity
AZURE_MANAGED_IDENTITY_CLIENT_ID= # Required
AZURE_OPENAI_ENDPOINT= # Required
AZURE_OPENAI_API_VERSION= # Optional, defaults to 2025-03-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME= # Optional, defaults to model_name
```

### Option 3: API Key Authentication

```bash
AZURE_OPENAI_API_KEY= # Required
AZURE_OPENAI_ENDPOINT= # Required
AZURE_OPENAI_API_VERSION= # Optional, defaults to 2025-03-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME= # Optional, defaults to model_name
```
