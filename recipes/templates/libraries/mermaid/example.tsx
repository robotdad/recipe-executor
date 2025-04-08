// Example usage of Mermaid Diagram Component
import React, { useState } from 'react';
import { MermaidDiagram } from './MermaidDiagram';

// Sample diagram definitions
const SAMPLE_DIAGRAMS = {
  flowchart: `
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
  `,
  sequence: `
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
  `,
  classDiagram: `
classDiagram
    class Animal {
      +name: string
      +age: int
      +makeSound(): void
    }
    class Dog {
      +breed: string
      +fetchBall(): void
    }
    class Cat {
      +furColor: string
      +ignoreHumans(): void
    }
    Animal <|-- Dog
    Animal <|-- Cat
  `,
  gantt: `
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2023-01-12, 12d
    another task     :24d
  `
};

export const MermaidExample: React.FC = () => {
  const [diagramType, setDiagramType] = useState<keyof typeof SAMPLE_DIAGRAMS>('flowchart');
  const [customDiagram, setCustomDiagram] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [theme, setTheme] = useState<'default' | 'forest' | 'dark' | 'neutral'>('default');
  
  // Get the current diagram content
  const currentDiagram = useCustom ? customDiagram : SAMPLE_DIAGRAMS[diagramType];
  
  // Handle diagram type change
  const handleDiagramTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDiagramType(e.target.value as keyof typeof SAMPLE_DIAGRAMS);
    setUseCustom(false);
  };
  
  // Handle custom diagram input
  const handleCustomDiagramChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomDiagram(e.target.value);
  };
  
  // Handle render notifications
  const handleRender = () => {
    console.log('Diagram rendered successfully!');
  };
  
  // Handle render errors
  const handleError = (error: Error) => {
    console.error('Diagram rendering error:', error);
  };
  
  return (
    <div className="mermaid-example">
      <div className="controls">
        <div className="control-group">
          <label>
            Diagram Type:
            <select
              value={diagramType}
              onChange={handleDiagramTypeChange}
              disabled={useCustom}
            >
              <option value="flowchart">Flowchart</option>
              <option value="sequence">Sequence Diagram</option>
              <option value="classDiagram">Class Diagram</option>
              <option value="gantt">Gantt Chart</option>
            </select>
          </label>
          
          <label>
            Theme:
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
            >
              <option value="default">Default</option>
              <option value="forest">Forest</option>
              <option value="dark">Dark</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={useCustom}
              onChange={() => setUseCustom(!useCustom)}
            />
            Use Custom Diagram
          </label>
        </div>
        
        {useCustom && (
          <div className="custom-diagram">
            <textarea
              value={customDiagram}
              onChange={handleCustomDiagramChange}
              placeholder="Enter your Mermaid diagram definition here..."
              rows={10}
              cols={60}
            />
          </div>
        )}
      </div>
      
      <div className="diagram-container">
        <h3>Diagram Preview</h3>
        <MermaidDiagram
          chart={currentDiagram}
          config={{ theme }}
          height="400px"
          onRender={handleRender}
          onError={handleError}
        />
      </div>
      
      {!useCustom && (
        <div className="diagram-source">
          <h3>Diagram Source</h3>
          <pre>{currentDiagram}</pre>
        </div>
      )}
    </div>
  );
};