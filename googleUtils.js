const {google} = require('googleapis');

const GOOGLE_DRIVE = {
    CLIENT_ID: process.env.GOOGLE_DRIVE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
    FOLDER_ID: '1ZQPgNTWN1QHAEQEJkzRCn2VpJrvXX5w3',
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

module.exports = {
    uploadReportToGoogle,
}
