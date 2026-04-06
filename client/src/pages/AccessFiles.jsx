import { useState } from "react"
import { Input, Button } from "../components/ui"
import { getConference } from '../firebase/services'
import { db } from '../firebase/config'
import { ref, get } from 'firebase/database'
import FileCard from '../components/FileCard'
import "../styles/AccessFiles.css"

const AccessFiles = () => {

    const [conferenceId, setConferenceId] = useState("")
    const [files, setFiles] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleAccess = async (e) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError("")
        setFiles(null)

        try {
            const conf = await getConference(conferenceId)
            if (!conf) throw new Error("Conference not found.")

            const filesRef = ref(db, `files/${conferenceId}`)
            const snapshot = await get(filesRef)

            if (snapshot.exists()) {
                setFiles(Object.values(snapshot.val()))
            } else {
                setFiles([])
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (files !== null) {
        return (
            <div className="access-files">
                <h1>Files from {conferenceId}</h1>
                <Button onClick={() => setFiles(null)}>Back</Button>
                {files.length === 0 ? <p>No files were created during this conference.</p> : (
                    <div className="file-grid">
                        {files.map(file => (
                            <FileCard key={file.id} file={file} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="access-files">
            <form className="normal-form">
                <header className="normal-form-header">
                    <h1>Access Files</h1>
                    <p>Your files are safe with us.</p>
                </header>

                <div className="normal-form-content">
                    <Input
                        label="Conference ID"
                        placeholder="e.g. monolith-alpha-99"
                        name="conferenceId"
                        onChange={e => setConferenceId(e.target.value)}
                        value={conferenceId}
                        required
                    />

                    {error && <p className="ui-error-msg" style={{ color: 'red' }}>{error}</p>}

                    <button className="ui-element ui-button-primary" onClick={handleAccess} disabled={loading}>
                        {loading ? 'Searching...' : 'Access'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AccessFiles