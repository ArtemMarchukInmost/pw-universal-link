const express = require('express');
const path = require('path');

const PORT = process.env.PORT ?? 3000;
const app = express();

app.get('/apple-app-site-association', (req, res) => {
    const options = {
        root: path.join(__dirname)
    };

    res.sendFile('apple-app-site-association.json', options)
});

app.listen(PORT, () => {
    console.log('server has been started');
});
