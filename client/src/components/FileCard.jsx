import React from 'react';
import '../styles/FileCard.css';

const FileCard = ({ file }) => {
    const handleDownload = () => {
        const element = document.createElement("a");
        const fileContent = file.content || "";
        const fileExt = file.type === 'markdown' ? 'md' : 'txt';
        const fileBlob = new Blob([fileContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(fileBlob);
        element.download = `${file.name}.${fileExt}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="file-card">
            <div className="file-card-header">
                <h3 className="file-card-title">{file.name}</h3>
                <button className="file-card-download-btn" onClick={handleDownload}>
                    Download
                </button>
            </div>
            {/* <pre className="file-card-content">
                {file.content || 'Empty file'}
            </pre> */}
        </div>
    );
};

export default FileCard;
