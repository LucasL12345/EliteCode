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

function Problems() {
    const [problems, setProblems] = useState([]);

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
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                    cursor: 'pointer'
                                }}
                                onClick={() => { window.location.href = `/problems/${problem.id}` }}
                            >
                                <TableCell sx={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {problem.title}
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: 'none', borderLeft: 'none' }}>
                                    <DifficultyChip difficulty={problem.difficulty} />
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: 'none', borderLeft: 'none' }}>Placeholder</TableCell>
                            </TableRow>

                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box>
    );
}

export default Problems;
