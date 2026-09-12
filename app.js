const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome To DevOps CI/CD Project');
});

app.listen(3000);
