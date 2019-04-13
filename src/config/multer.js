const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const School = require('../../src/models/School');
const mime_types = require('mime-types');

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'terms'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'terms'));
        },
        filename: async (req, file, cb) => {
            const school = await School.findOne({ cnpj: req.params.cnpj });
            const extension = mime_types.extension(file.mimetype);

            file.key = `${school.cnpj}-${school.name}.${extension}`;

            cb(null, file.key);
        }
    })
}