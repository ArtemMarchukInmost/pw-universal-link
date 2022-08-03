const express = require('express');
const bodyParser = require('body-parser');
const HOOK_KEY = process.env.HOOK_KEY;
const PORT = process.env.PORT ?? 3000;
const app = express();

const {proceedExecutionStart} = require('./utils');

app.use(bodyParser());

app.get('', (req, res) => {
    res.status(200);
    res.send('<h1>Hello</h1>');
});

app.post('/hook/end', async (req, res) => {
    const key = req.query.key;

    if (key !== HOOK_KEY) {
        res.sendStatus(403);
        return;
    }

    try {
        const data = req.body.data;
        console.log(req.body);

        if (req.body.event === 'JobReportSummary') {
            await proceedExecutionStart(data);
        }

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log('server has been started');
});
