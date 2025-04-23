// Home.js
import { useState, useEffect } from 'react';
import styles from './Home.module.css';

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
        <div className={styles.appContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.headerSection}>
                    <h1 className={styles.appTitle}>AI Background Remover</h1>
                    <p className={styles.appSubtitle}>Upload an image to instantly remove the background</p>
                </div>

                <div className={styles.mainCard}>
                    <div className={styles.gridContainer}>
                        {/* Upload Section */}
                        <div className={styles.uploadSection}>
                            <div className={styles.fileUploadArea}>
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className={styles.fileInput}
                                />
                                <label htmlFor="file-upload" className={styles.fileUploadLabel}>
                                    <div className={styles.uploadContent}>
                                        <svg className={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span>Click to upload or drag and drop</span>
                                        {file && <span className={styles.fileName}>{file.name}</span>}
                                    </div>
                                </label>
                            </div>

                            <button
                                className={styles.optionsToggleButton}
                                onClick={() => setShowOptions(!showOptions)}
                                aria-expanded={showOptions}
                            >
                                <span>Advanced Options</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {showOptions && (
                                <div className={styles.optionsForm}>
                                    <h3 className={styles.optionsTitle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="3"></circle>
                                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                        </svg>
                                        Background Removal Options
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="background">Background Color</label>
                                        <input
                                            type="text"
                                            id="background"
                                            name="background"
                                            value={options.background}
                                            onChange={handleOptionChange}
                                            className={styles.formControl}
                                            placeholder="Enter background color or gradient"
                                        />
                                    </div>
                                    <div className={styles.checkboxGroup}>
                                        <input
                                            type="checkbox"
                                            id="enhance"
                                            name="enhance"
                                            checked={options.enhance}
                                            onChange={handleOptionChange}
                                        />
                                        <label htmlFor="enhance">Enhance Image Quality</label>
                                    </div>
                                    <div className={styles.checkboxGroup}>
                                        <input
                                            type="checkbox"
                                            id="vector"
                                            name="vector"
                                            checked={options.vector}
                                            onChange={handleOptionChange}
                                        />
                                        <label htmlFor="vector">Convert to Vector</label>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!file || processing}
                                className={`${styles.processButton} ${processing ? styles.disabled : ''}`}
                            >
                                {processing ? (
                                    <>
                                        <div className={styles.buttonLoading}>
                                            <div className={styles.spinner}>
                                                <div className={styles.spinnerCircle}></div>
                                                <div className={styles.spinnerPath}></div>
                                            </div>
                                        </div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        Remove Background
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Preview Section */}
                        <div className={styles.previewSection}>
                            <h3 className={styles.sectionTitle}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                Preview
                            </h3>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                            ) : (
                                <div className={styles.emptyResult}>
                                    <div className={styles.emptyContent}>
                                        <svg className={styles.emptyIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h4 className={styles.emptyTitle}>No Image Selected</h4>
                                        <p className={styles.emptyDescription}>Upload an image to see the preview</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Result Section */}
                        {processing && (
                            <div className={styles.processingAnimation}>
                                <div className={styles.loadingSpinner}></div>
                                <h3 className={styles.loadingText}>Processing Image</h3>
                                <p className={styles.loadingSubtext}>This may take a few moments...</p>
                            </div>
                        )}

                        {imageUrl && !processing && (
                            <div className={styles.resultSection}>
                                <h3 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                    Result
                                </h3>
                                <div className={styles.resultContent}>
                                    <div className={styles.resultImageContainer}>
                                        <img src={imageUrl} alt="Processed" className={styles.resultImage} />
                                    </div>
                                    <a
                                        href={imageUrl}
                                        download="processed-image.png"
                                        className={styles.downloadButton}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download Image
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function addParticles() {
    // Add particles animation logic here
}