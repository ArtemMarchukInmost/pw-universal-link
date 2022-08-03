const express = require('express');
const bodyParser = require('body-parser');
const HOOK_KEY = process.env.HOOK_KEY;
const PORT = process.env.PORT ?? 3000;
const app = express();

const {sendFailedMessageToChat} = require('./utils');

app.use(bodyParser());

app.get('', (req, res) => {
    res.status(200);
    res.send('<h1>Hello</h1>');
});

app.post('/hook/end', async (req, res) => {
    const key = req.query.key;

    if (key !== HOOK_KEY) {
        res.sendStatus(403);
    }

    const data = req.body.data;
    console.log(data);
    if (data.result  === 'Failed') {
        await sendFailedMessageToChat(data);
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log('server has been started');
});
