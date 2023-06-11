import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import problemData from './problems.json';
import AceEditor from 'react-ace';
import Split from 'react-split';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

function Problem() {
    const { id } = useParams();
    const problem = problemData.find(problem => problem.id === parseInt(id));

    const [code, setCode] = useState(problem.boilerplate);
    const [output, setOutput] = useState('');

    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [results, setResults] = useState([]);

    const buttonStyle = {
        margin: "10px",
        padding: "5px",
        borderRadius: "5px",
        backgroundColor: "#f0f0f0",
        cursor: "pointer"
    };

    useEffect(() => {
        setCode(problem.boilerplate);
    }, [problem]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    const handleRunClick = async () => {
        try {
            const response = await fetch('http://localhost:4000/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, functionName: problem.functionName, testCases: problem.testCases }),
            });

            if (response.ok) {
                const result = await response.json();
                const { output, status } = result;

                if (Array.isArray(output)) {
                    setResults(output);
                } else if (typeof output === 'string') {
                    setResults([{ output, status: 'error' }]);
                } else {
                    console.error('Output from server is not an array:', result.output);
                    setResults([]);
                }
            } else {
                console.error('Error from server:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
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
            <div className="problem-section">
                <h2>{problem.title}</h2>
                <h3>Description</h3>
                <p>{problem.description}</p>
            </div>
            <div className="editor-section">
                <h3>Editor</h3>
                <AceEditor
                    mode="python"
                    theme="monokai"
                    onChange={handleCodeChange}
                    value={code}
                    editorProps={{ $blockScrolling: true }}
                    wrapEnabled={true}
                    style={{ width: '100%' }}
                    className="ace-editor"
                />
                <div className="run-section">
                    <h3>Result</h3>
                    <button className="run-button" onClick={handleRunClick}>Run</button>
                </div>
                <div className="output-container">
                    <h2 style={{ color: results.every(result => result.status === 'passed') ? 'green' : 'red' }}>
                        {results.every(result => result.status === 'passed') ? 'Tests Passed' : 'Tests Failed'}
                    </h2>

                    <div>
                        {results.map((result, index) => (
                            <button
                                key={index}
                                className={`case-button ${result.status} ${selectedTestCase === index ? 'selected' : ''}`}
                                onClick={() => setSelectedTestCase(index)}
                            >
                                Case {index + 1}
                            </button>
                        ))}
                    </div>

                    {results.length > 0 && (
                        <div>
                            <div className="case-detail-section">
                                <h3>Input</h3>
                                <div className="case-detail-container">
                                    <p>{JSON.stringify(results[selectedTestCase].input)}</p>
                                </div>
                            </div>

                            <div className="case-detail-section">
                                <h3>Expected Output</h3>
                                <div className="case-detail-container">
                                    <p>{JSON.stringify(results[selectedTestCase].expectedOutput)}</p>
                                </div>
                            </div>

                            <div className="case-detail-section">
                                <h3>Output</h3>
                                <div className="case-detail-container">
                                    <p>{JSON.stringify(results[selectedTestCase].actualOutput)}</p>
                                </div>
                            </div>

                            <div className="case-detail-section">
                                <h3>Stdout</h3>
                                <div className="case-detail-container">
                                    <p>{results[selectedTestCase].output}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Split>
    );
}

export default Problem;
