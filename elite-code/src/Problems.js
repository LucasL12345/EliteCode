import React from 'react';
import { Link } from 'react-router-dom';

function Problems() {
  const problems = [
    { id: 1, title: 'Problem 1' },
    { id: 2, title: 'Problem 2' },
    { id: 3, title: 'Problem 3' },
  ];

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
