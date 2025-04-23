# AI Background Remover

A powerful web application that uses AI to remove backgrounds from images. Built with Next.js and the `@harshit_01/ai-bg-remover` library.

## Features

- Upload images and remove backgrounds with a single click
- Customize background removal options:
  - Choose from different background styles (gradients, solid colors)
  - Select different AI models for background removal
  - Toggle image enhancement
- Beautiful UI with particle animation effects
- Download processed images directly from the browser

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-bg-remover-app.git
cd ai-bg-remover-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Click the upload area or drag and drop an image
2. (Optional) Click "Show Options" to customize background removal settings
3. Click "Remove Background" to process the image
4. Once processing is complete, the result will be displayed
5. Click "Download Image" to save the processed image

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [@harshit_01/ai-bg-remover](https://www.npmjs.com/package/@harshit_01/ai-bg-remover) - AI background removal library
- [multer](https://www.npmjs.com/package/multer) - File upload handling
- [next-connect](https://www.npmjs.com/package/next-connect) - API route handling

## Project Structure

- `pages/index.js` - Main application UI
- `pages/api/remove-bg.js` - API endpoint for background removal
- `styles/Home.css` - Application styles
- `public/uploads/` - Temporary storage for uploaded images
- `public/outputs/` - Storage for processed images

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Developed by Harshit & Amul ✨
