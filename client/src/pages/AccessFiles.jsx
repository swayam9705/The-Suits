import { useState } from "react"
import { Button, Input } from "../components/ui"

import "../styles/AccessFiles.css"

const AccessFiles = () => {

    const [ confId, setConfId ] = useState("")

    const handleAccessFiles = () => {
        console.log("Loading the documents from conference ID: ", confId)
    }
    
    return (
        <div className="access-files">
            <form className="normal-form">
                <header className="normal-form-header">
                    <h1>Access Conference Documents</h1>
                </header>

                <div className="normal-form-container">
                    <Input
                        label="Conference ID"
                        placeholder="e.g. monolith-alpha-99"
                        name="conferenceId"
                        value={confId}
                        onChange={e => setConfId(e.target.value)}
                        required 
                    />

                    <Button
                        className="access-files-btn"
                        onClick={handleAccessFiles}
                    >
                        Access Docs
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AccessFiles