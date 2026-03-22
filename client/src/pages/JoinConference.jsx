import { useState } from "react"
import { Link } from "react-router"
import { Button, Input } from "../components/ui"
import "../styles/JoinConference.css"

const AVATAR_COLORS = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#FFB833'
]

const JoinConference = () => {
    const [ formData, setFormData ] = useState({
        conferenceId: "",
        username: "",
        avatarColor: AVATAR_COLORS[0]
    })

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

    const handleJoin = e => {
        e.preventDefault()
        console.log("Joining with: ", formData)
    }

    return (
        <div className="join-page-wrapper">
            <form className="join-card">
                <header className="join-header">
                    <h1>Enter Workspace</h1>
                    <p>Collaborate instantly. No sign-up bullsh*t required.</p>
                </header>

                <div className="join-form">
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

                    <div className="ui-input-group" style={{ marginTop: '16px' }}>
                        <label className="ui-label">Avatar Color</label>
                        <div className="ui-color-picker">
                            {AVATAR_COLORS.map(color => (
                                <button 
                                    type="button"
                                    key={color}
                                    className={`color-swatch ${formData.avatarColor === color ? 'active' : ''}`}
                                    onClick={() => handleColorChange(color)}
                                    style={{backgroundColor: color}}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleJoin}
                    >
                        Join Conference
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