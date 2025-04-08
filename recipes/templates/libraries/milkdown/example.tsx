// Example usage of Milkdown Editor
import React, { useState } from 'react';
import { MilkdownEditor } from './MilkdownEditor';

// Sample markdown content for demonstration
const SAMPLE_MARKDOWN = `# Milkdown Editor Example

## Features

- WYSIWYG Markdown editing
- CommonMark support
- GFM (GitHub Flavored Markdown) support
- Math equations with KaTeX
- History (undo/redo)
- Customizable themes

## Code Example

\`\`\`typescript
function greeting(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Math Example

Inline equation: $E = mc^2$

Block equation:

$$
\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}
$$
`;

export const MilkdownEditorExample: React.FC = () => {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [readOnly, setReadOnly] = useState(false);
  
  const handleChange = (value: string) => {
    setMarkdown(value);
    console.log('Markdown updated:', value);
  };
  
  return (
    <div className="milkdown-example">
      <div className="controls">
        <label>
          <input 
            type="checkbox" 
            checked={readOnly} 
            onChange={() => setReadOnly(!readOnly)} 
          />
          Read-only mode
        </label>
      </div>
      
      <MilkdownEditor
        initialValue={markdown}
        onChange={handleChange}
        readOnly={readOnly}
        height="600px"
        width="100%"
        theme="light"
      />
      
      <div className="output-section">
        <h3>Editor Output</h3>
        <pre>{markdown}</pre>
      </div>
    </div>
  );
};