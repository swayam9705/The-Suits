import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import { Input, Button } from '../components/ui'
import { createConference, joinConference } from '../firebase/services';
const AVATAR_COLORS = ['#000000', '#666666', '#FF5733', '#33FF57', '#3357FF', '#F333FF'];

const CreateConference = () => {


    const [formData, setFormData] = useState({
        conferenceId: '',
        username: '',
        avatarColor: AVATAR_COLORS[0],
        isPrivate: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const generateId = () => {
        const adjectives = ['silent', 'focused', 'bold', 'clear', 'vivid', 'great', "adorable", "adventurous", "beautiful", "brave", "calm", "clever", "happy", "kind", "smart"];
        const nouns = ['monolith', 'stone', 'page', 'word', 'flow', 'river', 'mountain', 'ocean', 'forest', 'desert', 'sky', 'star', 'moon', 'sun', 'rain'];
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

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Create conference
            await createConference(formData.conferenceId, formData.username);

            // Join as admin
            const memberData = await joinConference(
                formData.conferenceId,
                formData.username,
                formData.avatarColor,
                true // is_admin
            );

            // Store user data in localStorage so conference room knows who this is
            localStorage.setItem(`conference_${formData.conferenceId}_memberId`, memberData.id);

            // Redirect to conference room
            navigate(`/conferenceRoom/${formData.conferenceId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-page-wrapper">
            <form className="normal-form">
                <header className="normal-form-header">
                    <h1>Create Workspace</h1>
                    <p>Start a new collaborative session instantly.</p>
                </header>

                <div className="normal-form-content">
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

                    {error && <p className="ui-error-msg" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

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
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Start Conference'}
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