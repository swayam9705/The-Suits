import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import { Markdown } from "tiptap-markdown"
import Placeholder from "@tiptap/extension-placeholder"

import "../../styles/TiptapEditor.css"

const MenuBar = ({ editor }) => {
    if (!editor) return null

    return (
        <div className="editor-menu-bar">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullet List</button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Ordered List</button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code Block</button>
            <div className="divider"></div>
            <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
            <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
        </div>
    )
}

const TiptapEditor = ({ provider, username, avatarColor }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ history: false }),
            Markdown,
            Placeholder.configure({ placeholder: "Start typing your manifesto..."}),
            Collaboration.configure({
                document: provider.document
            }),
            CollaborationCursor.configure({
                provider: provider,
                user: { username, avatarColor }
            })
        ]
    })

    return (
        <div className="tiptap-wrapper">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="tiptap-content" />
        </div>
    )
}

export default TiptapEditor