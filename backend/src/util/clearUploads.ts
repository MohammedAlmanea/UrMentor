import { promises as fs } from 'fs';

export const clearUploadsDirectory = async () => {
    const uploadDir = './uploads';
    
    try {
      // Check if the directory is empty
      const files = await fs.readdir(uploadDir);
      if (files.length === 0) {
        // Directory is empty, no need to proceed further
        return;
      }

      // Process file deletion
      const unlinkPromises = files.map(filename => fs.unlink(`${uploadDir}/${filename}`));
      await Promise.all(unlinkPromises);
    } catch (err) {
      console.error('Error clearing uploads directory:', err);
      throw err;
    }
};

