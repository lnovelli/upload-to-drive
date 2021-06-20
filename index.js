const actions = require('@actions/core');
const { google } = require('googleapis');
const fs = require('fs');

/** Google Service Account credentials  encoded in base64 */
const credentials = actions.getInput('credentials', { required: true });

/** file path to upload */
const localFileToUpload = actions.getInput('localFileToUpload', { required: true });

/** remote file id to update with target file */
const remoteFileId = actions.getInput('remoteFileId', { required: true });

/** name to assign to the new remote file, once uploaded */
const remoteFileName = actions.getInput('remoteFileName', { required: true });

// fileID of the WIN installer
const WIN_INSTALLER_ID = '1hrYalu6hN_aMG0XK24pwDlZtVaWQUKCw';

// fileID of the MAC installer
const MAC_INSTALLER_ID = '1zlULncU3XI5mJLYoAd3OX_Vki-ju9tYQ';

const credentialsJSON = JSON.parse(Buffer.from(credentials, 'base64').toString());

const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.JWT(credentialsJSON.client_email, null, credentialsJSON.private_key, scopes);
const drive = google.drive({ version: 'v3', auth });

/**
 * Uploads the file to Google Drive
 */
function updateFile() {
    console.info('Uploading file to Goole Drive...');
    //drive.files.get({
    //    fileId: WIN_INSTALLER_ID
    //}).then(file => {
    // The file exists, update it
    drive.files.update({
        fileId: remoteFileId,
        requestBody: { name: remoteFileName },
        media: { body: fs.createReadStream(localFileToUpload) }
    }).then(() => console.info('File uploaded successfully'))
        .catch(e => {
            console.error('Upload failed');
            throw e;
        });
    //})
}

updateFile();