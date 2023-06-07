import React from 'react';
import { useParams } from 'react-router-dom';

function Problem() {
  const { id } = useParams();

  const problem = {
    id: id,
    title: `Problem ${id}`,
    description: `This is the description for Problem ${id}`,
  };

  const handleRunClick = () => {
    // TODO
  };

  const handleSubmitClick = () => {
    // TODO
  };

  return (
    <div>
      <h2>{problem.title}</h2>
      <div>
        <div>
          <h3>Description</h3>
          <p>{problem.description}</p>
        </div>
        <div>
          <h3>Editor</h3>
          <textarea />
          <button onClick={handleRunClick}>Run</button>
          <button onClick={handleSubmitClick}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Problem;
