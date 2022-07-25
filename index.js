const express = require('express');
const path = require('path');

const PORT = process.env.PORT ?? 3000;
const app = express();

app.get('', (req, res) => {
    res.status(200);
    res.send('<h1>Hello</h1>');
})

app.get('/.well-known/apple-app-site-association', (req, res) => {
    const options = {
        root: path.join(__dirname)
    };

    res.type('application/pkcs7-mime');
    res.status(200);
    res.sendFile('apple-app-site-association.json', options)
});

app.listen(PORT, () => {
    console.log('server has been started');
});
