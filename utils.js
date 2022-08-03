const axios = require('axios');
const GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK;
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1dIMuGeM9LPM880OYWyIwKBoe68zuUfE1YWFEPo8506k/edit?usp=sharing'


const sendFailedMessageToChat = async (data) => {
    const message = `<font color=\\"#ff0000\\"><b>${data.name} was failed.<b></font> <${GOOGLE_SHEET_URL}| Check it out>.`;

    await axios.post(GOOGLE_CHAT_WEBHOOK, {
        text: message
    });
};

const proceedExecutionStart = async (data) => {
    if (data.result  === 'Failed') {
        await sendFailedMessageToChat(data);
    }
}

module.exports = {
    proceedExecutionStart,
};
