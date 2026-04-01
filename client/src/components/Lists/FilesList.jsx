import React, { useState } from 'react';
import { FileText, FileCode, MoreVertical, Plus, Trash2, Edit3 } from 'lucide-react';
import "../../styles/FilesList.css"

const FilesList = ({ files, createNewFile }) => {

    const [selectedFileId, setSelectedFileId] = useState('1');

    return (
        <div className="files-list-wrapper">
            <div className="files-header">
                <span className="section-label">Files</span>
                <button
                    className="add-file-btn"
                    title="Create New File"
                    onClick={createNewFile}
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="files-scroll-area">
                {files.map((file) => (
                    <div 
                        key={file.id} 
                        className={`file-item ${selectedFileId === file.id ? 'active' : ''}`}
                        onClick={() => setSelectedFileId(file.id)}
                    >
                        {/* Indicator bar for active file */}
                        {selectedFileId === file.id && <div className="active-indicator" />}
                        
                        <div className="file-icon">
                            {file.type === 'markdown' ? <FileText size={16} /> : <FileCode size={16} />}
                        </div>

                        <span className="file-name">{file.name}</span>

                        <div className="file-actions-trigger">
                            <MoreVertical size={14} />
                            {/* This would link to your Rename/Delete logic */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Optional Empty State */}
            {files.length === 0 && (
                <div className="empty-files">
                    <p>No files created yet.</p>
                </div>
            )}
        </div>
    );
};

export default FilesList;