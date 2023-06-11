import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import problemData from './problems.json';

function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    setProblems(problemData);
  }, []);

  return (
    <Box sx={{ width: '85%', margin: '0 auto', mt: 2, overflowX: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>Problems</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="problems table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{width: '70%'}}>Problem Title</TableCell>
              <TableCell sx={{width: '15%'}} align="center">Difficulty</TableCell>
              <TableCell sx={{width: '15%'}} align="center">Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.map((problem) => (
              <TableRow
                key={problem.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => {window.location.href=`/problems/${problem.id}`}}
                sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }, cursor: 'pointer'}}
              >
                <TableCell component="th" scope="row" style={{ backgroundColor: '#fff' }}>
                  {problem.title}
                </TableCell>
                <TableCell align="center">Placeholder</TableCell>
                <TableCell align="center">Placeholder</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Problems;
