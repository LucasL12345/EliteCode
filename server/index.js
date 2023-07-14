require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('./models/User');

const app = express();

mongoose.connect('mongodb://localhost/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));


app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, message: 'User registered successfully' });
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: 'Registration failed' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
});

// Middleware for protecting routes
const authenticate = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
});

app.post('/run', authenticate, (req, res) => {
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

app.post('/problem/:id/completed', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        if (!user.completedProblems.includes(req.params.id)) {
            user.completedProblems.push(req.params.id);
            
            const newSubmission = {
                problemId: req.params.id,
                status: 'accepted',
                time: new Date()
            };
            user.submissions.push(newSubmission);

            await user.save();
        }
        res.json({ message: 'Problem marked as completed' });
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to mark problem as completed' });
    }
});

app.get('/problem/:id/completed', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        const isCompleted = user.completedProblems.includes(req.params.id);
        res.json({ isCompleted });
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to get completion status' });
    }
});

// get the list of submissions for a specific problem
app.get('/problem/:id/submissions', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        const submissions = user.submissions.filter(submission => submission.problemId === req.params.id);
        res.json(submissions);
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to get submissions' });
    }
});

// save a submission for a specific problem
app.post('/problem/:id/submissions', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        user.submissions.push(req.body);
        await user.save();
        res.json({ message: 'Submission saved' });
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to save submission' });
    }
});


app.listen(4000, () => console.log('Server running on port 4000'));
