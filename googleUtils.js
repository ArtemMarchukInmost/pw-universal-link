const {google} = require('googleapis');
const moment = require('moment');

const GOOGLE_DRIVE = {
    CLIENT_ID: process.env.GOOGLE_DRIVE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
    FOLDER_ID: '1ZQPgNTWN1QHAEQEJkzRCn2VpJrvXX5w3',
    REDIRECT_URI: 'https://developers.google.com/oauthplayground',
};

const GOOGLE_SHEET = {
    CLIENT_ID: process.env.GOOGLE_SHEET_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_SHEET_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.GOOGLE_SHEET_REFRESH_TOKEN,
    SHEET_ID: '1dIMuGeM9LPM880OYWyIwKBoe68zuUfE1YWFEPo8506k',
    REDIRECT_URI: 'https://developers.google.com/oauthplayground',
};

const uploadReportToGoogle = async (fileStream, jobId, executionID) => {
    const oauth2Client = new google.auth.OAuth2(GOOGLE_DRIVE.CLIENT_ID, GOOGLE_DRIVE.CLIENT_SECRET, GOOGLE_DRIVE.REDIRECT_URI);

    oauth2Client.setCredentials({refresh_token: GOOGLE_DRIVE.REFRESH_TOKEN});

    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
    });

    const fileName = `${jobId}_${executionID}.pdf`;
    const mimeType = 'application/pdf';

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            mimeType,
            spaces: 'drive',
            parents: [GOOGLE_DRIVE.FOLDER_ID],
        },
        media: {
            mimeType,
            body: fileStream,
        },
    });

    return `https://drive.google.com/file/d/${response.data.id}/view`;
}

const updateGoogleSheet = async (executionData) => {
    const oauth2Client = new google.auth.OAuth2(GOOGLE_SHEET.CLIENT_ID, GOOGLE_SHEET.CLIENT_SECRET, GOOGLE_SHEET.REDIRECT_URI);

    oauth2Client.setCredentials({refresh_token: GOOGLE_SHEET.REFRESH_TOKEN});

    const sheets = google.sheets({
        version: 'v4',
        auth: oauth2Client,
    });

    const currentRowsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEET.SHEET_ID,
        range: executionData.spreadSheetName,
    });

    let currentRows = currentRowsResponse.data.values;
    let isFoundThisExecution = false;

    const newRows = currentRows.map((row, index) => {
        if (index === 0 || row[0] !== executionData.executionId) {
            return row;
        }

        isFoundThisExecution = true;

        const newRow = row;

        newRow[1] = executionData.startTime ? moment(executionData.startTime).format('DD.MM.YYY HH:mm') : newRow[1];
        newRow[2] = executionData.duration ? executionData.duration : newRow[2];
        newRow[3] = executionData.buildNumber ? executionData.buildNumber : newRow[3];
        newRow[4] = executionData.status ? executionData.status : newRow[4];
        newRow[5] = executionData.pdf ? executionData.pdf : newRow[5];
        newRow[6] = executionData.report ? executionData.report : newRow[5];

        return newRow.map(cell => cell === undefined ? '' : cell);
    });

    if (!isFoundThisExecution) {
        const newRow = [
            executionData.executionId,
            executionData.startTime ? moment(executionData.startTime).format('DD.MM.YYY HH:mm') : '',
            executionData.duration ? executionData.duration : '',
            executionData.buildNumber,
            executionData.status,
            executionData.pdf,
            executionData.report,
        ];

        newRows.push(newRow.map(cell => cell === undefined ? '' : cell));
    }

    await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET.SHEET_ID,
        range: executionData.spreadSheetName,
        valueInputOption: 'RAW',
        resource: {
            values: newRows,
        },
    });
}

module.exports = {
    uploadReportToGoogle,
    updateGoogleSheet,
}
