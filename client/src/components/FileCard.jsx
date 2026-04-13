import React from 'react'
import { ArrowDownToLine } from "lucide-react"
import '../styles/FileCard.css';

const FileCard = ({ file }) => {
    const handleDownload = () => {
        const element = document.createElement("a");
        const fileContent = file.content || "";
        const fileExt = file.type === 'markdown' ? 'md' : 'txt';
        const fileBlob = new Blob([fileContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(fileBlob);
        element.download = `${file.name}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="file-card">
            <div className="file-card-header">
                <h3 className="file-card-title">{file.name.length > 10 ? file.name.slice(0, 10) : file.name}</h3>
                <button className="file-card-download-btn" onClick={handleDownload}>
                    <ArrowDownToLine />
                </button>
            </div>
        </div>
    );
};

export default FileCard;
