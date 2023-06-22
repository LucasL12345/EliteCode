import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [output, setOutput] = useState(null);

  useEffect(() => {
    const runPythonScript = async () => {
      try {
        const response = await axios.post('http://localhost:4000/run', 
          { /* your request data here */ }, 
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setOutput(response.data);
      } catch(err) {
        console.error(err);
        alert('Failed to run Python script');
      }
    };

    runPythonScript();
  }, []);

  return (
    <div>
      {output && <pre>{JSON.stringify(output, null, 2)}</pre>}
    </div>
  );
}

export default Home;
