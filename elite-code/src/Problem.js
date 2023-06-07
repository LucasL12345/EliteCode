import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import problemData from './problems.json';

function Problem() {
  const { id } = useParams();
  const problem = problemData.find(problem => problem.id === parseInt(id));

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleCodeChange = (event) => {
    setCode(event.target.value);
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
    <div>
      <h2>{problem.title}</h2>
      <div>
        <div>
          <h3>Description</h3>
          <p>{problem.description}</p>
        </div>
        <div>
          <h3>Editor</h3>
          <textarea value={code} onChange={handleCodeChange} />
          <button onClick={handleRunClick}>Run</button>
          <h3>Output</h3>
          <textarea readOnly value={output} />
        </div>
      </div>
    </div>
  );
}

export default Problem;
