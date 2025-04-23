import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { createRouter } from 'next-connect';
import { removeBackground } from '@harshit_01/ai-bg-remover';

// Configure multer to only accept image files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    // Preserve original file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only jpg, jpeg, and png files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const handler = createRouter();

handler.use(upload.single('image'));

handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const inputFile = req.file.path;
  const outputFileName = `${Date.now()}-output.png`;
  const outputFile = path.join('public', 'outputs', outputFileName);

  // Ensure the outputs directory exists
  const outputsDir = path.join('public', 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  // Parse options from the request
  let options = {
    background: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Default gradient background
    enhance: true,       // Enhance image quality
    vector: true,        // Convert output to SVG
    model: 'silueta'     // Model to use
  };

  try {
    // If options are provided in the request, parse them
    if (req.body.options) {
      const userOptions = JSON.parse(req.body.options);
      options = { ...options, ...userOptions };
    }
  } catch (error) {
    console.error('Error parsing options:', error);
    // Continue with default options if parsing fails
  }

  try {
    const result = await removeBackground(inputFile, outputFile, options);
    
    // Clean up the uploaded file
    fs.unlinkSync(inputFile);
    
    // Return the relative path for the frontend to use
    const imageUrl = `/outputs/${outputFileName}`;
    
    res.status(200).json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Background removed successfully'
    });
  } catch (error) {
    console.error('🔥 Error removing background:', error);
    
    // Clean up the uploaded file in case of error
    if (fs.existsSync(inputFile)) {
      fs.unlinkSync(inputFile);
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Background removal failed'
    });
  }
});

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
};

export default handler.handler();
