import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import problemData from './problems.json';
import AceEditor from 'react-ace';
import Split from 'react-split';
import axios from 'axios';
import Chip from '@mui/material/Chip';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-chrome';


const TAB_NAMES = {
    DESCRIPTION: 'Description',
    SOLUTIONS: 'Solutions',
    SUBMISSIONS: 'Submissions',
};

function TabButton({ name, isActive, onClick }) {
    return (
        <button
            className={`tab-button ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {name}
        </button>
    );
}

function TabView({ name, isActive, children }) {
    return isActive ? <div className={`tab-view tab-view-${name}`}>{children}</div> : null;
}

function Problem() {
    const { id } = useParams();
    const location = useLocation();

    const [problem, setProblem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [code, setCode] = useState('');
    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [results, setResults] = useState([]);
    const [runError, setRunError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState(TAB_NAMES.DESCRIPTION);
    const [submissions, setSubmissions] = useState([]);

    const fetchProblem = async () => {
        const problemValue = problemData.find((problem) => problem.id === parseInt(id));
        if (problemValue) {
            setCode(problemValue.boilerplate);
            setProblem(problemValue);
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchProblem();
    }, [id]);

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

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:4000/problem/${id}/submissions`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSubmissions(response.data);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch submissions');
            }
        };
        fetchSubmissions();
    }, [id]);


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
        const testCases = problem.testCases;
        const functionName = problem.functionName;

        const payload = {
            code: code,
            testCases: testCases,
            functionName: functionName,
        };

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:4000/run', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResults(response.data.output);
            setRunError(null);
        } catch (error) {
            console.error('Error from server:', error.response.status, error.response.statusText);
            setRunError('Error from server: ' + error.response.status + ' ' + error.response.statusText);
            return;
        }

        if (results.length > 0 && results.every((result) => result.status === 'passed')) {
            try {
                await axios.post(`http://localhost:4000/problem/${id}/completed`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setSubmitted(true);
                setActiveTab(TAB_NAMES.SUBMISSIONS);

                // Add the new submission
                const newSubmission = {
                    problemId: id,
                    status: 'Accepted',
                    time: Date.now(),
                };
                setSubmissions((prevSubmissions) => [...prevSubmissions, newSubmission]);

                // Update the backend
                try {
                    await axios.post(`http://localhost:4000/problem/${id}/submissions`, newSubmission, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                } catch (err) {
                    console.error(err);
                    alert('Failed to save submission');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to submit the problem');
            }
        } else {
            // Add the new submission
            const newSubmission = {
                problemId: id,
                status: 'Rejected',
                time: Date.now(),
            };
            setSubmissions((prevSubmissions) => [...prevSubmissions, newSubmission]);
            setActiveTab(TAB_NAMES.SUBMISSIONS);

            // Update the backend
            try {
                await axios.post(`http://localhost:4000/problem/${id}/submissions`, newSubmission, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } catch (err) {
                console.error(err);
                alert('Failed to save submission');
            }
        }
    };

    const DifficultyChip = ({ difficulty }) => {
        let color = '';
        switch (difficulty) {
            case 'Easy':
                color = 'green';
                break;
            case 'Medium':
                color = 'orange';
                break;
            case 'Hard':
                color = 'red';
                break;
            default:
                color = 'black';
        }

        return (
            <Chip label={difficulty} variant="outlined" sx={{ color: color, borderColor: color }} />
        );
    }


    useEffect(() => {
        const checkCompletion = async () => {
            try {
                const username = localStorage.getItem('username');
                if (username) {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:4000/problem/${id.toString()}/completed`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setSubmitted(response.data.isCompleted);
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkCompletion();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const numLines = problem.solution_code.split('\n').length;

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
                        <div>
                            <div className="tabs">
                                {Object.values(TAB_NAMES).map((tabName) => (
                                    <TabButton
                                        key={tabName}
                                        name={tabName}
                                        isActive={activeTab === tabName}
                                        onClick={() => setActiveTab(tabName)}
                                    />
                                ))}
                            </div>

                            <TabView name='Description' isActive={activeTab === 'Description'}>
                                <div className="problem-description-container">
                                    <h2>{problem.title}</h2>
                                    <DifficultyChip difficulty={problem.difficulty} />
                                    <div style={{ height: '26px' }}></div>
                                    <div>{problem.description.split("\n").map((item, key) => {
                                        return <span key={key}>{item}<br /><br /></span>
                                    })}</div>
                                </div>
                            </TabView>

                            <TabView name='Solutions' isActive={activeTab === 'Solutions'}>
                                <div className="problem-description-container">
                                    <h2>Solutions</h2>
                                    <div>{problem.solution_text.split("\n").map((item, key) => {
                                        return <span key={key}>{item}<br /><br /></span>
                                    })}</div>

                                    <h3>Code</h3>
                                    <AceEditor
                                        mode="python"
                                        theme="chrome"
                                        value={problem.solution_code}
                                        editorProps={{ $blockScrolling: true }}
                                        wrapEnabled={true}
                                        style={{ 
                                            width: '100%', 
                                            height: `${numLines * 24}px`, 
                                            border: '1px solid grey',
                                            borderRadius: '5px'
                                        }}
                                        className="ace-editor"
                                        readOnly
                                    />
                                    <div style={{ height: '22px' }}></div>
                                    <h4>Time complexity: {problem.solution_time_complexity}</h4>
                                    <h4>Space complexity: {problem.solution_space_complexity}</h4>
                                </div>
                            </TabView>

                            <TabView name='Submissions' isActive={activeTab === 'Submissions'}>
                                <h2>Submissions</h2>
                                {submissions.slice().reverse().map((submission, index) => (
                                    <div key={index} className="submission-container">
                                        <p className={`submission-status ${submission.status === 'Accepted' ? 'submission-status-accepted' : 'submission-status-rejected'}`}>{submission.status}</p>
                                        <p className="submission-time"> {new Intl.DateTimeFormat('en-GB', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }).format(new Date(submission.time))}
                                        </p>
                                    </div>
                                ))}
                            </TabView>

                        </div>
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
                        <div class="run-section">
                            <h3>Result</h3>
                            <div class="button-group">
                                <button id="run" class="run-button" onClick={handleRunClick}>Run</button>
                                <button id="submit" class="submit-button" onClick={handleSubmitClick}>Submit</button>
                            </div>
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
