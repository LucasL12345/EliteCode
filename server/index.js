const express = require('express');
const cors = require('cors');
const { PythonShell } = require('python-shell');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/run', (req, res) => {
    let pyshell = new PythonShell('main.py');
    let output = '';
  
    pyshell.send(JSON.stringify(req.body));
  
    pyshell.on('message', function(message) {
      output += message;
    });
  
    pyshell.end(function (err, code, signal) {
      if (err) {
        res.send(err);
      } else {
        // Parse the output string back into JSON
        let outputJson;
        try {
          outputJson = JSON.parse(output);
        } catch (error) {
          console.error('Could not parse output from Python script:', error);
          res.status(500).json({ error: 'Failed to parse output from Python script' });
          return;
        }
        
        res.json(outputJson);
      }
    });
});

  

app.listen(4000, () => console.log('Server running on port 4000'));
