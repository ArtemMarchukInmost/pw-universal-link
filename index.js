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

    res.status(200);
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'apple-app-site-association');
    res.sendFile('apple-app-site-association.json', options)
});

app.listen(PORT, () => {
    console.log('server has been started');
});
