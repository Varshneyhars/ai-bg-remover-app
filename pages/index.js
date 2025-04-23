// Home.js
import { useState, useEffect } from 'react';
import './Home.css'; // Import the CSS file

export default function Home() {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [processing, setProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    
    useEffect(() => {
        addParticles();
    }, []);
    
    // Add state for background removal options
    const [options, setOptions] = useState({
        background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
        enhance: true,
        vector: true,
        model: 'silueta'
    });
    
    // Add state for showing/hiding options form
    const [showOptions, setShowOptions] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl('');
        }
    };

    const handleOptionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOptions({
            ...options,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setProcessing(true);
        const formData = new FormData();
        formData.append("image", file);
        
        // Add options to formData
        formData.append("options", JSON.stringify(options));

        try {
            const res = await fetch("/api/remove-bg", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setImageUrl(data.imageUrl);
            } else {
                alert("❌ Failed to remove background. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("❌ An error occurred. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <div className="header-section">
                    <h1 className="app-title">AI Background Remover</h1>
                    <p className="app-subtitle">Upload an image to instantly remove the background</p>
                </div>

                <div className="main-card">
                    <div className="grid-container">
                        {/* Upload Section */}
                        <div className="upload-section">
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="file-input"
                                />
                                <label htmlFor="file-upload" className="file-upload-label">
                                    <div className="upload-content">
                                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="file-name">
                                            {file ? file.name : 'Click to upload an image'}
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Options Toggle Button */}
                            <button 
                                type="button" 
                                className="options-toggle-button"
                                onClick={() => setShowOptions(!showOptions)}
                            >
                                {showOptions ? 'Hide Options' : 'Show Options'}
                            </button>

                            {/* Options Form */}
                            {showOptions && (
                                <div className="options-form">
                                    <h3 className="options-title">Background Removal Options</h3>
                                    
                                    <div className="form-group">
                                        <label htmlFor="background">Background:</label>
                                        <select 
                                            id="background" 
                                            name="background" 
                                            value={options.background}
                                            onChange={handleOptionChange}
                                            className="form-control"
                                        >
                                            {/* <option value="linear-gradient(to right, #ff7e5f, #feb47b)">Gradient (Orange)</option> */}
                                            <option value="linear-gradient(to right, #4facfe, #00f2fe)">Gradient (Blue)</option>
                                            <option value="linear-gradient(to right, #43e97b, #38f9d7)">Gradient (Green)</option>
                                            <option value="#FFFFFF">Solid White</option>
                                            <option value="#000000">Solid Black</option>
                                         
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="model">Model:</label>
                                        <select 
                                            id="model" 
                                            name="model" 
                                            value={options.model}
                                            onChange={handleOptionChange}
                                            className="form-control"
                                        >
                                            <option value="silueta">Silueta (Default)</option>
                                            {/* <option value="u2netp">U2NetP</option>
                                            <option value="u2net">U2Net</option>
                                            <option value="isnet-general-use">ISNet General Use</option> */}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                name="enhance" 
                                                checked={options.enhance}
                                                onChange={handleOptionChange}
                                            />
                                            Enhance image quality
                                        </label>
                                    </div>
                                    
                                    {/* <div className="form-group checkbox-group">
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                name="vector" 
                                                checked={options.vector}
                                                onChange={handleOptionChange}
                                            />
                                            Convert to SVG (vector)
                                        </label>
                                    </div> */}
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!file || processing}
                                className={`process-button ${!file || processing ? 'disabled' : ''}`}
                            >
                                {processing ? (
                                    <span className="button-loading">
                                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Remove Background'}
                            </button>

                            {previewUrl && (
                                <div className="preview-section">
                                    <h3 className="section-title">Original</h3>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="preview-image"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Result Section */}
                        <div className="result-section">
                            <h3 className="section-title">Result</h3>

                            {imageUrl ? (
                                <div className="result-content">
                                    <div className="result-image-container">
                                        <img
                                            src={imageUrl}
                                            alt="Result"
                                            className="result-image"
                                        />
                                    </div>
                                    <a
                                        href={imageUrl}
                                        download="background-removed.png"
                                        className="download-button"
                                    >
                                        Download Image
                                    </a>
                                </div>
                            ) : processing ? (
                                <div className="processing-animation">
                                    <div className="loading-spinner large"></div>
                                    <p className="loading-text">Removing background...</p>
                                </div>
                            ) : (
                                <div className="empty-result">
                                    <div className="empty-content">
                                        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <h3 className="empty-title">Processed image will appear here</h3>
                                        <p className="empty-description">Upload an image and click "Remove Background"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <h2>Developed By Harshit & Amul ✨</h2>
                </div>
            </div>
            <div className="particles"></div>
        </div>
    );
}


/* Add to your Home.js component */
function addParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
  
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 100 + 50;
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      const delay = Math.random() * 15;
      const duration = 15 + Math.random() * 10;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  // Call this in useEffect in your component