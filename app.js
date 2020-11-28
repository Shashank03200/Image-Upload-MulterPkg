const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path')


const PORT = process.env.port || 3000;

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/upload',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) );
    }
})

// Check File Type
function checkFileType(file, cb){
    // Allowed Extensions Regex
    const fileTypes = /jpeg|jpg|png|gif/;


    // Check extensions
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

    // Check MIME type
    // const mimeType = fileTypes.test(file.mimeType);

    // if( mimeType && extName) {
    if(extName) {
        cb(null, true);
    } else {
        cb('Error: Images Only.');
    }

}


// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Init app
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.render('index');
})

app.post('/upload', (req, res)=>{
    upload(req, res, (err) => {
        if(err){
            res.render('index', {msg:err});
        }
        else{
            if(req.file == undefined) {
                res.render('index', {msg:'Error: No file selected'});
            }  else {
                res.render('index', {
                    msg: 'File Uploaded',
                    file: `upload/${req.file.filename}`
                })
            }
        }

    })
})


app.listen(PORT, ()=>{
    console.log('Server started on port ' + PORT);
})


