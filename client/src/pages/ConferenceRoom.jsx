// packages 
import { useState, useEffect } from "react"
import { Link, useParams, useLocation } from "react-router"
import { HocuspocusProvider } from "@hocuspocus/provider"
import * as Y from "yjs"
import { createClient } from "@supabase/supabase-js"
import supabase from "../configs/supabase"

// components
import FilesList from "../components/Lists/FilesList"
import MembersList from "../components/Lists/MembersList"
import TiptapEditor from "../components/editor/TiptapEditor"

// icons and styles
import { FaFile, FaArrowLeft } from "react-icons/fa"
import { HiUsers } from "react-icons/hi"
import { FaGear } from "react-icons/fa6"
import { MdContactSupport } from "react-icons/md";
import "../styles/ConferenceRoom.css"


const ConferenceRoom = () => {

    const { conf_id } = useParams()
    const location = useLocation()    

    const { username, avatarColor } = location.state || { username: "Guest", avatarColor: "#000000"}

    const [ provider, setProvider ] = useState(null)
    const [ files, setFiles ] = useState([])
    const [ activeFileId, setActiveFileId ] = useState(null)
    const [ sidebarTab, setSidebarTab ] = useState("")
    const [members, setMembers] = useState([])


    const createNewFile = async () => {
        const newFile = {
            conf_id: conf_id,
            name: "Untitled.txt",
            type: "text/plain",
            // 'content' stays empty; Hocuspocus will fill it when someone starts typing
        };

        const { data, error } = await supabase
            .from('files')
            .insert([newFile])
            .select();

        if (data) {
            setFiles([...files, data[0]]);
            setActiveFileId(data[0].id);
        }
    }

    useEffect(() => {
        if (!conf_id || !activeFileId) return // Don't connect until a file is selected

        const ydoc = new Y.Doc()

        const newProvider = new HocuspocusProvider({
            url: "ws://127.0.0.1:1234",
            // name is now the File UUID
            name: activeFileId,
            document: ydoc,
            token: JSON.stringify({
                username: username,
                avatarColor: avatarColor
            })
        })

        newProvider.on("awarenessUpdate", ({ states }) => {
            const activeMembers = states.map(state => ({
                id: state.user.id,
                name: state.user.username,
                color: state.user.avatarColor,
                isOnline: true
            }))

            setMembers(activeMembers)
        })

        setProvider(newProvider)

        const fetchFiles = async () => {
            const { data, error } = await supabase
                .from('files')
                .select('*')
                .eq('conf_id', conf_id); // Matches the conf_id in your schema

            if (!error && data) {
                setFiles(data);
                // If there's at least one file, set it as active so the editor loads it
                if (data.length > 0) setActiveFileId(data[0].id);
            }
        };

        if (conf_id) fetchFiles();

        return () => {
            newProvider.disconnect()
            newProvider.destroy()
        }

    }, [activeFileId])

    return (
        <div className="room-page">
            
            {/* room sidebar */}
            <div className="sidebar">
                <div className={`sidebar-wrapper ${ sidebarTab === '' ? '' : 'active' }`}>
                    <div className="sidebar-primary">
                        <header className="header sidebar-primary-header">
                            Library
                        </header>

                        <div className="sidebar-link-items">
                            <button
                                className={`sidebar-link-item ${sidebarTab == 'files' ? 'active' : ''}`}
                                onClick={() => setSidebarTab("files")}
                            >
                                <FaFile /> Files
                            </button>
                            <button
                                className={`sidebar-link-item ${sidebarTab == 'members' ? 'active' : ''}`}
                                onClick={() => setSidebarTab("members")}
                            >
                                <HiUsers /> Members
                            </button>
                        </div>

                        <div className="sidebar-primary-bottom sidebar-link-items">
                            <button className="sidebar-link-item">
                                <FaGear /> Settings
                            </button>
                            <button className="sidebar-link-item">
                                <MdContactSupport /> Help 
                            </button>
                        </div>

                    </div>
                    <div className="sidebar-secondary">
                        <div className="sidebar-secondary-top">
                            <button
                                className="go-back-btn"
                                onClick={() => setSidebarTab('')}
                            ><FaArrowLeft /></button>
                        </div>
                        <div className="sidebar-secondary-content">
                            { sidebarTab === "files" && <FilesList files={files} createNewFile={createNewFile} /> }
                            { sidebarTab === "members" && <MembersList members={members} /> }
                        </div>
                    </div>
                </div>
            </div>

            {/* main */}
            <main className="room-editor-wrapper">
                {
                    provider ? (
                        <TiptapEditor
                            provider={provider}
                            username={username}
                            avatarColor={avatarColor}
                        />
                    ) : (
                        <div className="loading-state">Establishing secure connection...</div>
                    )
                }
            </main>
        </div>
    )
}

export default ConferenceRoom