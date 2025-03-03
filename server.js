const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { expressjwt: exjwt } = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

const secretKey = 'My Secret Key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        username: 'Ananya',
        password: '2702'
    },
    {
        username: 'Pagadala',
        password: '0123'
    },
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Received username:', username);
    console.log('Received password:', password);

    // Find the user based on the username
    const user = users.find(u => u.username === username);

    if (!user) {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect'
        });
        return;
    }

    if (password === user.password) {
        let token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '3m' });
        res.json({
            success: true,
            err: null,
            token
        });
    } else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect'
        });
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged-in people can see'
    });
});

app.get('/api/prices', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged-in people can see'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Settings page: Protected page'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect'
        });
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});