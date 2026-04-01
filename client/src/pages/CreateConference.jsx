import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import { Input, Button } from '../components/ui'

const AVATAR_COLORS = ['#000000', '#666666', '#FF5733', '#33FF57', '#3357FF', '#F333FF'];

const CreateConference = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        conferenceId: '',
        username: '',
        avatarColor: AVATAR_COLORS[0],
        isPrivate: false
    });

    const generateId = () => {
        const adjectives = ['silent', 'focused', 'bold', 'clear', 'vivid'];
        const nouns = ['monolith', 'stone', 'page', 'word', 'flow'];
        const num = Math.floor(Math.random() * 1000);
        const newId = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}-${num}`;
        
        setFormData(prev => ({ ...prev, conferenceId: newId }));
    };

    useEffect(() => {
        generateId();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = (e) => {
        e.preventDefault();

        navigate(`/conferenceRoom/${formData.conferenceId}`)
        
        console.log("Creating Workspace:", formData);
        // Redirect to /editor/:conferenceId
    };

    return (
        <div className="join-page-wrapper">
            <form className="normal-form">
                <header className="normal-form-header">
                    <h1>Create Workspace</h1>
                    <p>Start a new collaborative session instantly.</p>
                </header>

                <div className="normal-form-container">
                    <div className="ui-input-group">
                        <label className="ui-label">Conference ID</label>
                        <div className="ui-input-wrapper">
                            <Input 
                                name="conferenceId"
                                value={formData.conferenceId}
                                onChange={handleChange}
                                className="ui-input-with-action"
                                placeholder="name-your-workspace"
                                required
                            />
                            <button 
                                type="button" 
                                className="ui-input-action-btn"
                                onClick={generateId}
                            >
                                Regenerate
                            </button>
                        </div>
                    </div>
                    
                    <Input 
                        label="Your Admin Alias" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="e.g. Editor-in-Chief" 
                        required
                    />

                    <div className="ui-input-group" style={{ marginTop: '16px' }}>
                        <label className="ui-label">Avatar Color</label>
                        <div className="ui-color-picker">
                            {AVATAR_COLORS.map(color => (
                                <button 
                                    type="button"
                                    key={color}
                                    className={`color-swatch ${formData.avatarColor === color ? 'active' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormData(prev => ({ ...prev, avatarColor: color }))}
                                />
                            ))}
                        </div>
                    </div>

                    <Button 
                        onClick={handleCreate}
                    >
                        Start Conference
                    </Button>

                    <span className="join-footer">
                        <Link to="/joinConference">Join</Link> a conference instead.
                    </span>
                </div>
            </form>
        </div>
    );
};

export default CreateConference;