const multer = require("multer");
const util = require("util");
const path = require("path");
const maxSize = 5 * 1024 * 1024;
const PIC_PATH = path.join('/uploads/customers');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', PIC_PATH));
    },
    // filename with current date
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

let uploadingFile = multer({
    storage: storage,
    limits: {
        fileSize: maxSize,
    },
}).single('pic');

let uploadFileMiddleware = util.promisify(uploadingFile);
module.exports = uploadFileMiddleware;