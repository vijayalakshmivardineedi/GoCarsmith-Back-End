const multer = require('multer');

const storage = multer.memoryStorage(); // You can use diskStorage or any other storage type
const upload = multer({ storage: storage }).single('attachment');

exports.handleFileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // Handle Multer error
      return res.status(400).send('Multer error: ' + err.message);
    }

    // Access the uploaded file using req.file
    const uploadedFile = req.file;

    // Do something with the uploaded file (e.g., send it as an attachment in an email)
    // ...

    // Send a response to the client
    res.send('File uploaded successfully');
  });
};


