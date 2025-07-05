// upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const getStorage = (type) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${type}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${type}-${uniqueSuffix}${ext}`);
    },
  });

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Export separate uploaders
export const uploadQuotation = multer({
  storage: getStorage('quotations'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadInvoice = multer({
  storage: getStorage('invoices'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
