import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import problemData from './problems.json';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

function Problem() {
  const { id } = useParams();
  const problem = problemData.find(problem => problem.id === parseInt(id));

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleRunClick = async () => {
    const response = await fetch('http://localhost:4000/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const output = await response.text();
    setOutput(output);
  };

  return (
    <div className="problem-container">
      <div className="problem-description">
        <h2>{problem.title}</h2>
        <h3>Description</h3>
        <p>{problem.description}</p>
      </div>
      <div className="problem-editor">
        <h3>Editor</h3>
        <AceEditor
          mode="python"
          theme="monokai"
          onChange={handleCodeChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
        <button onClick={handleRunClick}>Run</button>
        <h3>Output</h3>
        <textarea readOnly value={output} />
      </div>
    </div>
  );
}

export default Problem;
