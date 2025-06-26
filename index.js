const express = require('express');
const multer = require('multer');
const { decryptMediaMessage } = require('@whiskeysockets/baileys');
const app = express();
const upload = multer();

app.post('/decrypt', upload.single('file'), async (req, res) => {
  try {
    const mediaKeyBase64 = req.body.mediaKey;
    const mimetype = req.body.mimetype;

    if (!mediaKeyBase64 || !req.file || !mimetype) {
      return res.status(400).json({ error: 'Falta mediaKey, mimetype o archivo' });
    }

    const mediaKey = Buffer.from(mediaKeyBase64, 'base64');
    const encryptedMedia = req.file.buffer;

    const decrypted = await decryptMediaMessage(
      { mediaKey, mimetype },
      encryptedMedia
    );

    res.setHeader('Content-Type', mimetype);
    res.send(decrypted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al desencriptar el audio' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));