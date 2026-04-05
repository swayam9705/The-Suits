import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Button, Input } from "../components/ui"
import { getConference, joinConference } from '../firebase/services';
import "../styles/JoinConference.css"

const AVATAR_COLORS = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#FFB833'
]

const JoinConference = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        conferenceId: "",
        username: "",
        avatarColor: AVATAR_COLORS[0]
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    // generic handler function
    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // specific handler function for color change
    const handleColorChange = color => {
        setFormData(prev => ({ ...prev, avatarColor: color }))
    }

    const handleJoin = async e => {
        e.preventDefault()
        setLoading(true);
        setError('');
        try {
            // Check if conference exists
            const conf = await getConference(formData.conferenceId);
            if (!conf) {
                throw new Error("Conference not found.");
            }
            if (conf.isLive === false) {
                throw new Error("The conference has Ended.");
            }

            // Join as member
            const memberData = await joinConference(
                formData.conferenceId,
                formData.username,
                formData.avatarColor,
                false // not an admin
            );

            // Store user data
            localStorage.setItem(`conference_${formData.conferenceId}_memberId`, memberData.id);

            // Redirect
            navigate(`/conferenceRoom/${formData.conferenceId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="join-page-wrapper">
            <form className="normal-form">
                <header className="normal-form-header">
                    <h1>Enter Workspace</h1>
                    <p>Collaborate instantly. No sign-up bullsh*t required.</p>
                </header>

                <div className="normal-form-content">
                    <Input
                        label="Conference ID"
                        placeholder="e.g. monolith-alpha-99"
                        name="conferenceId"
                        value={formData.conferenceId}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Your Name / Alias"
                        placeholder="How should others see you?"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    {error && <p className="ui-error-msg" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                    <div className="ui-input-group" style={{ marginTop: '16px' }}>
                        <label className="ui-label">Avatar Color</label>
                        <div className="ui-color-picker">
                            {AVATAR_COLORS.map(color => (
                                <button
                                    type="button"
                                    key={color}
                                    className={`color-swatch ${formData.avatarColor === color ? 'active' : ''}`}
                                    onClick={() => handleColorChange(color)}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleJoin}
                        disabled={loading}
                    >
                        {loading ? 'Joining...' : 'Join Conference'}
                    </Button>

                    <span className="join-footer">
                        <Link to="/createConference">Create</Link> your own conference instead.
                    </span>

                </div>
            </form>
        </div>
    )
}

export default JoinConference