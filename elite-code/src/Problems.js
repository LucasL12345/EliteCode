import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import problemData from './problems.json';
import axios from 'axios';
import Modal from 'react-modal';


function Problems() {
    const [problems, setProblems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleClick = (id) => {
        console.log('Problem clicked, id:', id);
        if (localStorage.getItem('token')) {
            window.location.href = `/problems/${id}`;
        } else {
            setModalIsOpen(true);
        }
    };
    

    useEffect(() => {
        setProblems(problemData);
    }, []);

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
        const fetchProblems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const responses = await Promise.all(problemData.map(problem =>
                        axios.get(`http://localhost:4000/problem/${problem.id}/completed`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                    ));
                    setProblems(responses.map((response, i) => ({
                        ...problemData[i],
                        completed: response.data.isCompleted
                    })));
                } else {
                    setProblems(problemData.map(problem => ({
                        ...problem,
                        completed: false
                    })));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProblems();
    }, []);
    




    return (
        <Box sx={{ width: '85%', margin: '0 auto', mt: 2, overflowX: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>Problems</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="problems table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#fff' }}>
                            <TableCell sx={{ width: '70%', borderRight: 'none', borderLeft: 'none' }}>Problem Title</TableCell>
                            <TableCell sx={{ width: '15%', borderRight: 'none', borderLeft: 'none' }} align="center">Difficulty</TableCell>
                            <TableCell sx={{ width: '15%', borderRight: 'none', borderLeft: 'none' }} align="center">Completed</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {problems.map((problem) => (
                            <TableRow
                                key={problem.id}
                                onClick={() => handleClick(problem.id)}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                    cursor: 'pointer'
                                }}
                            >
                                <TableCell sx={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {problem.title}
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: 'none', borderLeft: 'none' }}>
                                    <DifficultyChip difficulty={problem.difficulty} />
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {localStorage.getItem('token') ?
                                        (problem.completed ? 'Yes' : 'No')
                                        :
                                        'Login'
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
            </TableContainer>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        padding: '20px'
                    },
                }}
            >
                <h2>You are not logged in</h2>
                <p>Please log in or register to access the problems.</p>
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>

        </Box>


    );
}

export default Problems;
