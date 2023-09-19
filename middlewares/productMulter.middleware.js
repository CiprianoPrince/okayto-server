const multer = require('multer');
const toImageUrl = require('../../utils/toImageUrl');
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'storage/uploads/images/products');
    },
    filename: (request, file, cb) => {
        // Extract file extension
        const fileExtension = file.originalname.split('.').pop();

        const urlEncodedName = toImageUrl(request.body.name);
        // Construct the filename
        const filename = `${urlEncodedName}.${fileExtension}`;

        cb(null, filename);
    },
});

module.exports = multer({ storage: storage });
