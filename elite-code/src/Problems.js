import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import problemData from './problems.json';
import axios from 'axios';
import Modal from 'react-modal';
import tick_img from './images/tick_img.png'


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
        <Box sx={{ width: '75%', margin: '0 auto', mt: 2, overflow: 'auto' }}>
            <h2 align="center" class="special-h2"> Problems</h2>
            <TableContainer component={Paper} elevation={0} style={{borderRadius: '10px'}}>
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
                                        (problem.completed ? <img src={tick_img} alt="img" style={{ height: '2em', width: 'auto' }}/> : '')
                                        :
                                        <Link to="/login" className="login-link">Login</Link>
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
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>Not logged in</h2>
                <p>Please login to continue</p>
                <div className="modal-buttons">
                    <Link to="/login" className="modal-button login">Login</Link>
                    <Link to="/register" className="modal-button register">Register</Link>
                </div>
            </Modal>
        </Box>


    );
}

export default Problems;
