const axios = require('axios');
const GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK;
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1dIMuGeM9LPM880OYWyIwKBoe68zuUfE1YWFEPo8506k/edit?usp=sharing';

const sendFailedMessageToChat = async (data) => {
    await axios.post(GOOGLE_CHAT_WEBHOOK, {
        cards: [
            {
                sections: [
                    {
                        widgets: [
                            {
                                textParagraph: {
                                    text: `<font color='#ff0000'><b>${data.name} was failed.</b></font>`,
                                },
                                buttons: [
                                    {
                                        textButton: {
                                            text: 'Check it out',
                                            onClick: {
                                                openLink: {
                                                    url: GOOGLE_SHEET_URL
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
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
