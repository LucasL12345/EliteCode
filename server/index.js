const express = require('express');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// Connect to MongoDB.
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User model.
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

// Configure Passport.js.
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
            return done(null, user);
        });
    }
));
passport.serializeUser(function (user, done) { done(null, user.id); });
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) { done(err, user); });
});

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'your-session-secret',
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/test' }),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.post('/register', function (req, res) {
    const username = req.body.username;
    const password = bcrypt.hashSync(req.body.password, 10); // Hash the password.

    const user = new User({ username, password });
    user.save(function (err) {
        if (err) { res.status(500).json({ message: 'Error registering user.' }); return; }
        res.json({ message: 'User registered successfully.' });
    });
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.json({ message: 'User logged in successfully.' });
});

app.post('/run', (req, res) => {
    if (!req.user) { res.status(401).json({ message: 'User not logged in.' }); return; }

    let pyshell = new PythonShell('main.py');
    let output = '';

    pyshell.send(JSON.stringify(req.body));

    pyshell.on('message', function (message) {
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
