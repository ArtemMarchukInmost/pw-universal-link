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
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Keep-Alive', 'timeout=60');
    res.removeHeader('Server');
    res.removeHeader('X-Powered-By');
    res.removeHeader('Accept-Ranges');
    res.removeHeader('Last-Modified');
    res.removeHeader('Etag');
    res.removeHeader('Cache-Control');
    res.sendFile('apple-app-site-association.json', options)
});

app.get('/.well-known/assetlinks.json', (req, res) => {
    const options = {
        root: path.join(__dirname)
    };

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.sendFile('assetlinks.json', options)
});

app.post('/hook', (req, res) => {
    console.log(JSON.stringify(req));
    res.status(200);
    res.json({status: 200});
});

app.listen(PORT, () => {
    console.log('server has been started');
});
