import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import problemData from './problems.json';
import AceEditor from 'react-ace';
import Split from 'react-split';
import axios from 'axios';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

function Problem() {
    const { id } = useParams();
    const location = useLocation();

    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [results, setResults] = useState([]);
    const [runError, setRunError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const problemValue = problemData.find((problem) => problem.id === parseInt(id));
        setProblem(problemValue);

        if (problemValue) {
            setCode(problemValue.boilerplate);
        }
    }, [id]);

    useEffect(() => {
        if (problem) {
            setCode(problem.boilerplate);
        }
    }, [problem]);

    useEffect(() => {
        const submittedState = localStorage.getItem(`submitted-${location.pathname}`);
        if (submittedState && submittedState !== 'undefined') {
            setSubmitted(JSON.parse(submittedState));
        }
    }, [location.pathname]);

    useEffect(() => {
        if (submitted !== undefined) {
            localStorage.setItem(`submitted-${location.pathname}`, JSON.stringify(submitted));
        }
    }, [submitted, location.pathname]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    const handleRunClick = () => {
        const testCases = problem.testCases;
        const functionName = problem.functionName;

        const payload = {
            code: code,
            testCases: testCases,
            functionName: functionName,
        };

        const token = localStorage.getItem('token');

        axios
            .post('http://localhost:4000/run', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                setResults(res.data.output);
                setRunError(null);
            })
            .catch((error) => {
                console.error('Error from server:', error.response.status, error.response.statusText);
                setRunError('Error from server: ' + error.response.status + ' ' + error.response.statusText);
            });
    };

    const handleSubmitClick = async () => {
        if (results.length > 0 && results.every((result) => result.status === 'passed')) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`http://localhost:4000/problem/${id}/completed`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSubmitted(true);
            } catch (err) {
                console.error(err);
                alert('Failed to submit the problem');
            }
        } else {
            alert('Please make sure all tests pass before submitting!');
        }
    };

    useEffect(() => {
        const checkCompletion = async () => {
            try {
                const username = localStorage.getItem('username');
                if (username) {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:4000/problem/${id}/completed`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setSubmitted(response.data.completed);
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkCompletion();
    }, [id]);


    return (
        <>
            {problem ? (
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
                            <button className="run-button" onClick={handleRunClick}>
                                Run
                            </button>
                            <button className="submit-button" onClick={handleSubmitClick}>
                                {submitted ? 'Submitted' : 'Submit'}
                            </button>
                        </div>
                        <div className="output-container">
                            {results.length === 0 ? (
                                <h4 style={{ color: 'grey' }}>Please run your code first</h4>
                            ) : (
                                <>
                                    <h2 style={{ color: results.every((result) => result.status === 'passed') ? 'green' : 'red' }}>
                                        {results.every((result) => result.status === 'passed') ? 'Tests Passed' : 'Tests Failed'}
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
                                </>
                            )}
                        </div>
                        <div className="space"></div>
                    </div>
                </Split>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default Problem;
