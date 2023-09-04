const express = require('express');
const multer = require("multer");
const controllers = require("../controllers/user")
const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage });

router.get('/', controllers.fetchData);
router.get('/employeeExport', controllers.exportEmployee);
router.post('/employeeImport', upload.single('file'), controllers.importEmployee);
router.post('/create', controllers.createRecord);
router.put('/update', controllers.updateRecord);
router.delete('/delete/:id', controllers.deleteRecord);

module.exports = router;