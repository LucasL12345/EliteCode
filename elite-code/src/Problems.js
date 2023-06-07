import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import problemData from './problems.json';

function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    setProblems(problemData);
  }, []);

  return (
    <div>
      <h2>Problems</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id}>
              <td>
                <Link to={{ pathname: `/problems/${problem.id}` }}>{problem.title}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Problems;
