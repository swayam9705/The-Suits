import React, { useState } from 'react'
import { Users, Shield, Circle } from 'lucide-react'
import "../../styles/MembersList.css"

const MembersList = ({ members }) => {
    // State to hold the list of active members
    // In production, this will be populated by your WebSocket/Hocuspocus provider

    return (
        <div className="members-list-wrapper">
            <div className="members-header">
                <div className="members-title-group">
                    <span className="section-label">Presence</span>
                    <span className="members-count">{members.filter(m => m.isOnline).length} Online</span>
                </div>
                <Users size={16} className="header-icon" />
            </div>

            <div className="members-scroll-area">
                {members.map((member) => (
                    <div key={member.id} className={`member-item ${!member.isOnline ? 'offline' : ''}`}>
                        <div className="avatar-container">
                            <div 
                                className="member-avatar" 
                                style={{ backgroundColor: member.color }}
                            >
                                {member.name.charAt(0)}
                            </div>
                            {member.isOnline && <div className="online-indicator" />}
                        </div>

                        <div className="member-info">
                            <span className="member-name">
                                {member.name}
                                {member.isAdmin && <Shield size={10} className="admin-icon" title="Admin" />}
                            </span>
                            <span className="member-status">
                                {member.isOnline ? 'Active now' : 'Away'}
                            </span>
                        </div>

                        {/* Visual cue for their cursor color */}
                        <div className="color-preview">
                             <Circle size={8} fill={member.color} stroke="none" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="members-footer">
                <button className="invite-link-btn">
                    COPY INVITE LINK
                </button>
            </div>
        </div>
    );
};

export default MembersList