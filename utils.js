const axios = require('axios');
const GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK;
const TEST_PROJECT_API_KEY = process.env.TEST_PROJECT_API_KEY;

const TEST_PROJECT_PROJECT_ID = 'I0OwalcUV02uT4wmupf4-w';
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1dIMuGeM9LPM880OYWyIwKBoe68zuUfE1YWFEPo8506k/edit?usp=sharing';

const {uploadReportToGoogle} = require('./googleUtils');

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

const downloadReportPdf = async (data) => {
    const JOB_ID = data.reportUrl.split('/')[8];
    const EXECUTION_ID = data.reportUrl.split('/')[10].split('?')[0];

    const url = `https://api.testproject.io/v2/projects/${TEST_PROJECT_PROJECT_ID}/jobs/${JOB_ID}/reports/${EXECUTION_ID}`;

    const response  = await axios.get(url,{
        headers: {authorization: TEST_PROJECT_API_KEY},
        params: {
            details: true,
            format: 'PDF',
        },
    });

    const reportUrl = response.data.reportUrl;

    const reportResponse = await axios.get(reportUrl, {
        responseType: 'stream',
        responseEncoding: 'binary',
    });

    return  await uploadReportToGoogle(reportResponse.data, JOB_ID, EXECUTION_ID);
}

const proceedExecutionEnd = async (data) => {
    if (data.result  === 'Failed') {
        await sendFailedMessageToChat(data);
    }

    const url = await downloadReportPdf(data);

    console.log(url);
}

module.exports = {
    proceedExecutionEnd,
};
