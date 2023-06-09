import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import problemData from './problems.json';
import AceEditor from 'react-ace';
import Split from 'react-split';

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
    <Split 
        sizes={[50, 50]} 
        minSize={100} 
        expandToMin={true} 
        gutterSize={10} 
        className="split"
        gutter={(index, direction) => {
            const gutter = document.createElement('div');
            gutter.className = `gutter gutter-${direction}`;
            return gutter;
        }}
    >
      <div>
        <h2>{problem.title}</h2>
        <h3>Description</h3>
        <p>{problem.description}</p>
      </div>
      <div>
        <h3>Editor</h3>
        <AceEditor
            mode="python"
            theme="monokai"
            onChange={handleCodeChange}
            editorProps={{ $blockScrolling: true }}
            wrapEnabled={true}
            style={{ width: '100%' }}
        />
        <button onClick={handleRunClick}>Run</button>
        <h3>Output</h3>
        <textarea readOnly value={output} />
      </div>
    </Split>
  );
}

export default Problem;