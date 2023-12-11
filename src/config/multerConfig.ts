
import multer from 'multer';
import path from 'path';
//TODO Checks for different mime types to make sure only images are uploaded

//! FILE NAME DOES NOT GET THROUGH RN IDKWTD

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, '../images/');
    cb(null, destinationPath); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    console.log(`${Date.now()}${ext}`)
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

export default upload;
