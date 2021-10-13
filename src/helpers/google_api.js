const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: "v3",
    auth: oauth2Client
});

const fileGoogle = {
    upload: async (fileName, mimeType) => {
        try {
            const createFile = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType
                },
                media: {
                    mimeType,
                    body: fs.createReadStream(path.join(__dirname, `../../public/images/${fileName}`))
                }
            });
            // console.log('upload::::' ,createFile);
            const getUrl = await fileGoogle.setFilePublic(createFile.data.id);
            const fileInfo = {
                id: createFile.data.id,
                linkView: getUrl.data.webViewLink,
                linkDownload: getUrl.data.webContentLink
            }
            return fileInfo;
        } catch (error) {
            throw error;
        }
    },

    delete: async (fileId) => {
        try {
            const deleteFile = await drive.files.delete({
                fileId
            });
            return deleteFile;
        } catch (error) {
            throw error;
        }
    },

    setFilePublic:  async (fileId) => {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            const getUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink, webContentLink'
            });

            return getUrl;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = fileGoogle;