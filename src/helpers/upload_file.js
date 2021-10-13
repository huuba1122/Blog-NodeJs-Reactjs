const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images'));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '_' + file.originalname;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' 
        || file.mimetype == 'image/jpg'
        || file.mimetype == 'image/png'
    ){
        cb(null, true);
    } else {
        cb('Only .png, .jpeg, .jpg format allowed!',false);
    }
};

const maxSize = 1 * 1024 * 1024; //1mB

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: maxSize}
})

module.exports = upload;