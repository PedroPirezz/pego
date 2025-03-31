const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();  // Carrega variáveis do .env

const IdfolderGoogleApi = '1MslqHebojNJEQjZ9h8cvMvqALDL8USAx';

async function uploadFileToDrive(filePath, fileName) {
  try {
    // Obtém as credenciais do Google a partir do ambiente
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
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
      mimeType: 'image/png',  // Ou ajuste conforme o tipo de arquivo
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
  uploadFileToDrive,
};
