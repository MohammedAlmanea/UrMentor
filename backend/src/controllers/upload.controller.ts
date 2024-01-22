import { Request, Response } from 'express';
import { upload } from '../config/multer';

export const uploadFile = (req: Request, res: Response) => {
  upload(req, res, (err: any) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ message: 'No file selected!' });
      } else {
        console.log(req.file);
        res.status(200).json({
          message: 'File uploaded successfully!',
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
};
