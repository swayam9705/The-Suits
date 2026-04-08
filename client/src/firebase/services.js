import { db } from './config';
import { ref, set, get, push, update, remove, serverTimestamp } from 'firebase/database';

// Utility to create unique ids
export const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// ===============
// CONFERENCE
// ===============
export const createConference = async (conf_id, admin_alias) => {
    const conferenceRef = ref(db, `conferences/${conf_id}`);
    
    // Check if it already exists
    const snapshot = await get(conferenceRef);
    if (snapshot.exists()) {
        throw new Error("Conference ID already taken.");
    }

    const conferenceData = {
        id: generateId(),
        conf_id,
        created_at: Date.now(),
        admin_alias,
        ended_at: null,
        isLive: true
    };

    await set(conferenceRef, conferenceData);
    return conferenceData;
};

export const getConference = async (conf_id) => {
    const conferenceRef = ref(db, `conferences/${conf_id}`);
    const snapshot = await get(conferenceRef);
    if (snapshot.exists()) {
        return snapshot.val();
    }
    return null;
};

export const endConferenceDb = async (conf_id) => {
    const conferenceRef = ref(db, `conferences/${conf_id}`);
    await update(conferenceRef, {
        isLive: false,
        ended_at: Date.now()
    });
};

// ===============
// MEMBER
// ===============
export const joinConference = async (conf_id, user_alias, color, is_admin = false) => {
    const memberId = generateId();
    const memberRef = ref(db, `members/${conf_id}/${memberId}`);
    
    const memberData = {
        id: memberId,
        conf_id,
        user_alias,
        color,
        is_admin,
        joined_at: Date.now()
    };

    await set(memberRef, memberData);
    return memberData;
};

export const leaveConferenceDb = async (conf_id, memberId) => {
    const memberRef = ref(db, `members/${conf_id}/${memberId}`);
    await remove(memberRef);
};

export const updateMemberCursor = async (conf_id, memberId, activeFileId, cursorPosition) => {
    const memberRef = ref(db, `members/${conf_id}/${memberId}`);
    await update(memberRef, {
        activeFileId,
        cursorPosition
    });
};

// ===============
// FILE
// ===============
export const createFile = async (conf_id, name, type) => {
    const fileId = generateId();
    const fileRef = ref(db, `files/${conf_id}/${fileId}`);
    
    const fileData = {
        id: fileId,
        conf_id,
        name,
        type, // 'text' or 'markdown'
        content: '',
        updated_at: Date.now()
    };

    await set(fileRef, fileData);
    return fileData;
};

export const updateFileContent = async (conf_id, fileId, content) => {
    const fileRef = ref(db, `files/${conf_id}/${fileId}`);
    await update(fileRef, {
        content,
        updated_at: Date.now()
    });
};

export const renameFile = async (conf_id, fileId, newName) => {
    const fileRef = ref(db, `files/${conf_id}/${fileId}`);
    await update(fileRef, {
        name: newName,
        updated_at: Date.now()
    });
};

export const deleteFile = async (conf_id, fileId) => {
    const fileRef = ref(db, `files/${conf_id}/${fileId}`);
    await remove(fileRef);
};
