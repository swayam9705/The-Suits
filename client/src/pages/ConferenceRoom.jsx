import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { db } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import { createFile, updateFileContent, renameFile, deleteFile, endConferenceDb } from '../firebase/services';
import { FileText, Plus, Users, Trash2, Edit2, LogOut, Check, X, Copy } from 'lucide-react';
import '../styles/ConferenceRoom.css';

const ConferenceRoom = () => {
    const { conf_id } = useParams();
    const navigate = useNavigate();

    const [files, setFiles] = useState({});
    const [members, setMembers] = useState({});
    const [conference, setConference] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeFileId, setActiveFileId] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    
    const [editingFileId, setEditingFileId] = useState(null);
    const [editingFileName, setEditingFileName] = useState('');

    const [copied, setCopied] = useState(false);

    // Current user member id
    const currentMemberId = localStorage.getItem(`conference_${conf_id}_memberId`);

    useEffect(() => {
        if (!currentMemberId) {
            navigate('/joinConference');
            return;
        }

        // Listen to Conference
        const confRef = ref(db, `conferences/${conf_id}`);
        const unsubConf = onValue(confRef, (snapshot) => {
            if (snapshot.exists()) {
                setConference(snapshot.val());
                setLoading(false);
            } else {
                navigate('/'); // Doesn't exist
            }
        });

        // Listen to Members
        const membersRef = ref(db, `members/${conf_id}`);
        const unsubMembers = onValue(membersRef, (snapshot) => {
            if (snapshot.exists()) {
                setMembers(snapshot.val());
            } else {
                setMembers({});
            }
        });

        // Listen to Files
        const filesRef = ref(db, `files/${conf_id}`);
        const unsubFiles = onValue(filesRef, (snapshot) => {
            if (snapshot.exists()) {
                const filesData = snapshot.val();
                setFiles(filesData);
                // Set default active if none
                if (!activeFileId && Object.keys(filesData).length > 0) {
                    setActiveFileId(Object.keys(filesData)[0]);
                }
            } else {
                setFiles({});
            }
        });

        return () => {
            unsubConf();
            unsubMembers();
            unsubFiles();
        };
    }, [conf_id, activeFileId, currentMemberId, navigate]);

    const handleCreateFile = async (e) => {
        e.preventDefault();
        if (!newFileName.trim()) return;

        try {
            const newFile = await createFile(conf_id, newFileName, 'text');
            setActiveFileId(newFile.id);
            setNewFileName('');
            setIsCreatingFile(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        if (activeFileId) {
            // Update local optimistically
            setFiles(prev => ({
                ...prev,
                [activeFileId]: {
                    ...prev[activeFileId],
                    content: newContent
                }
            }));
            
            // Sync to Firebase
            updateFileContent(conf_id, activeFileId, newContent);
        }
    };

    const handleDeleteFile = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteFile(conf_id, id);
            if (activeFileId === id) {
                setActiveFileId(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleStartRename = (e, file) => {
        e.stopPropagation();
        setEditingFileId(file.id);
        setEditingFileName(file.name);
    };

    const handleRenameSubmit = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!editingFileName.trim()) {
            setEditingFileId(null);
            return;
        }
        try {
            await renameFile(conf_id, id, editingFileName);
            setEditingFileId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEndConference = async () => {
        if (members[currentMemberId]?.is_admin) {
            try {
                await endConferenceDb(conf_id);
            } catch (err) {
                console.error("Error ending conference:", err);
            }
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(conf_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="loading-state">Loading Conference...</div>;

    if (conference && conference.isLive === false) {
        return (
            <div className="conference-room-wrapper" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
                <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                    <X size={48} style={{ color: 'var(--text-primary)', marginBottom: '16px' }} />
                    <h2 style={{ fontFamily: 'var(--font-header)', marginBottom: '8px', color: 'var(--text-primary)' }}>The conference has Ended</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>You can no longer enter or edit files.</p>
                    <button className="create-file-btn" onClick={() => navigate('/')} style={{ marginTop: '24px' }}>
                        Return Home
                    </button>
                    <button className="new-file-btn" onClick={() => navigate('/accessFiles')} style={{ marginTop: '12px', margin: '12px auto 0' }}>
                        Access Files
                    </button>
                </div>
            </div>
        );
    }

    const filesList = Object.values(files);
    const membersList = Object.values(members);
    const activeFile = activeFileId ? files[activeFileId] : null;

    return (
        <div className="conference-room-wrapper">
            <aside className="conference-sidebar">
                <div className="sidebar-section">
                    <h3>Files</h3>
                    <div className="file-list">
                        {filesList.map(f => (
                            <div 
                                key={f.id} 
                                className={`file-item ${activeFileId === f.id ? 'active' : ''}`}
                                onClick={() => setActiveFileId(f.id)}
                            >
                                <div className="file-item-info">
                                    <FileText size={16} />
                                    {editingFileId === f.id ? (
                                        <form onSubmit={(e) => handleRenameSubmit(e, f.id)} className="rename-form">
                                            <input
                                                autoFocus
                                                value={editingFileName}
                                                onChange={(e) => setEditingFileName(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                onBlur={(e) => handleRenameSubmit(e, f.id)}
                                                className="rename-input"
                                            />
                                        </form>
                                    ) : (
                                        <span className="file-name">{f.name}</span>
                                    )}
                                </div>
                                
                                {editingFileId !== f.id && (
                                    <div className="file-actions">
                                        <button 
                                            className="action-btn edit-btn" 
                                            onClick={(e) => handleStartRename(e, f)}
                                            title="Rename"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            onClick={(e) => handleDeleteFile(e, f.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {isCreatingFile ? (
                        <form className="create-file-form" onSubmit={handleCreateFile}>
                            <input 
                                className="create-file-input"
                                autoFocus
                                value={newFileName}
                                onChange={e => setNewFileName(e.target.value)}
                                placeholder="Filename"
                                onBlur={() => !newFileName && setIsCreatingFile(false)}
                            />
                            <button type="submit" className="create-file-btn">Add</button>
                        </form>
                    ) : (
                        <div 
                            className="new-file-btn" 
                            onClick={() => setIsCreatingFile(true)}
                        >
                            <Plus size={16} />
                            <span>New File</span>
                        </div>
                    )}
                </div>

                <div className="sidebar-section">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} /> Members
                    </h3>
                    <div className="members-list">
                        {membersList.map(m => (
                            <div key={m.id} className="member-item">
                                <div className="member-avatar" style={{ backgroundColor: m.color }}>
                                    {m.user_alias.charAt(0).toUpperCase()}
                                </div>
                                <span>{m.user_alias} {m.id === currentMemberId && '(You)'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-section end-conference-section">
                    <button className="copy-id-btn" onClick={handleCopyId}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Conference ID'}
                    </button>
                    {members[currentMemberId]?.is_admin && (
                        <button className="end-conference-btn" onClick={handleEndConference}>
                            <LogOut size={16} />
                            End Conference
                        </button>
                    )}
                </div>
            </aside>

            <main className="conference-main">
                {activeFile ? (
                    <>
                        <header className="editor-header">
                            {activeFile.name}
                        </header>
                        <textarea
                            className="editor-area"
                            value={activeFile.content}
                            onChange={handleContentChange}
                            placeholder="Start typing..."
                        />
                    </>
                ) : (
                    <div className="empty-state">
                        <FileText className="empty-state-icon" size={48} />
                        Select or create a file to start editing.
                    </div>
                )}
            </main>
        </div>
    );
};

export default ConferenceRoom;