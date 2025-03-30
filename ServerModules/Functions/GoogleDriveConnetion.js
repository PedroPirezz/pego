const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { google } = require('googleapis');
const IdfolderGoogleApi = '1MslqHebojNJEQjZ9h8cvMvqALDL8USAx';

async function uploadFileToDrive(filePath, fileName) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './PegoCredentials.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const driveService = google.drive({
      version: 'v3',
      auth,
    });

    const fileMetadata = {
      name: fileName,
      parents: [IdfolderGoogleApi],
    };

    const media = {
      mimeType: 'image/png',
      body: fs.createReadStream(filePath),
    };

    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    return response.data.id;
  } catch (error) {
    console.error('Erro ao fazer upload para o Google Drive:', error);
    throw error;
  }
}

module.exports = {
  uploadFileToDrive
};