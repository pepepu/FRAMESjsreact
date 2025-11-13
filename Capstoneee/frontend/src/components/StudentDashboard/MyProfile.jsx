import React from 'react';
import './MyProfile.css';

// Dummy data for the profile
const userData = {
    fullName: 'Michael Chen',
    studentId: '2024001',
    email: 'michael.chen@student.edu',
    phone: '+1 (555) 123-4567',
    dob: '03/15/2002',
    address: '123 University Avenue, Campus City, State 12345',
    avatar: '/path/to/michael-chen-avatar.jpg', // Placeholder
    
    // Academic Info
    program: 'Bachelor of Engineering',
    major: 'Computer Science',
    year: '2nd Year',
    expectedGraduation: 'May 2026',
    gpa: '3.75',
    academicAdvisor: 'Dr. Sarah Johnson',
    
    // Emergency Contact
    emergencyName: 'Jennifer Chen',
    emergencyRelationship: 'Mother',
    emergencyPhone: '+1 (555) 007-6543',
    emergencyEmail: 'jennifer.chen@email.com',
};

const MyProfile = () => {
    return (
        // Use a wrapper div for the entire view (optional class 'profile-view-wrapper')
        // The existing .profile-container styles (max-width, centering) should be moved here if necessary
        <div className="profile-view-wrapper">
            
            {/* --- MOVED OUTSIDE THE CARD CONTAINER --- */}
            <h1 className="profile-title">My Profile</h1>
            {/* --- END MOVED TITLE --- */}

            <div className="profile-content-card">
                <div className="profile-header">
                    <div className="profile-info-block">
                        <img 
                            src={userData.avatar} 
                            alt="Profile Avatar" 
                            className="profile-avatar" 
                        />
                        <div className="profile-text-info">
                            <h2>{userData.fullName}</h2>
                            <p className="student-id-text">Student ID: {userData.studentId}</p>
                            <p className="student-status">
                                <span className="status-dot active"></span>
                                Computer Science • 2nd Year
                            </p>
                            <button className="btn-active-student">Active Student</button>
                        </div>
                    </div>
                    <button className="btn-edit-profile">
                        <i className="fas fa-edit"></i> Edit Profile
                    </button>
                </div>

                {/* --- Personal Information Section --- */}
                <div className="profile-section">
                    <h3>Personal Information</h3>
                    <div className="profile-grid">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" value={userData.fullName} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Student ID</label>
                            <input type="text" value={userData.studentId} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={userData.email} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input type="tel" value={userData.phone} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Date of Birth</label>
                            <input type="date" value={userData.dob} readOnly />
                        </div>
                        <div className="input-group full-width">
                            <label>Address</label>
                            <textarea rows="3" value={userData.address} readOnly></textarea>
                        </div>
                    </div>
                </div>

                {/* --- Academic Information Section --- */}
                <div className="profile-section academic-section">
                    <h3>Academic Information</h3>
                    <div className="profile-grid">
                        <div className="input-group">
                            <label>Program</label>
                            <input type="text" value={userData.program} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Major</label>
                            <input type="text" value={userData.major} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Year</label>
                            <input type="text" value={userData.year} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Expected Graduation</label>
                            <input type="text" value={userData.expectedGraduation} readOnly />
                        </div>
                        <div className="input-group">
                            <label>GPA</label>
                            <input type="text" value={userData.gpa} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Academic Advisor</label>
                            <input type="text" value={userData.academicAdvisor} readOnly />
                        </div>
                    </div>
                </div>

                {/* --- Emergency Contact Section --- */}
                <div className="profile-section">
                    <h3>Emergency Contact</h3>
                    <div className="profile-grid">
                        <div className="input-group">
                            <label>Contact Name</label>
                            <input type="text" value={userData.emergencyName} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Relationship</label>
                            <input type="text" value={userData.emergencyRelationship} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <input type="tel" value={userData.emergencyPhone} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={userData.emergencyEmail} readOnly />
                        </div>
                    </div>
                </div>

                {/* --- Account Settings Section --- */}
                <div className="profile-section account-settings-section">
                    <h3>Account Settings</h3>
                    <div className="setting-row">
                        <div className="setting-text">
                            <h4>Password</h4>
                            <p>Last changed 30 days ago</p>
                        </div>
                        <button className="btn-setting-action secondary-btn">
                            <i className="fas fa-lock"></i> Change Password
                        </button>
                    </div>

                    <div className="setting-row">
                        <div className="setting-text">
                            <h4>Two-Factor Authentication</h4>
                            <p>Add an extra layer of security</p>
                        </div>
                        <button className="btn-setting-action secondary-btn enabled-2fa">
                            <i className="fas fa-toggle-on"></i> Enable 2FA
                        </button>
                    </div>
                    
                    <div className="setting-row">
                        <div className="setting-text">
                            <h4>Privacy Settings</h4>
                            <p>Manage who can see your information</p>
                        </div>
                        <button className="btn-setting-action secondary-btn">
                            <i className="fas fa-shield-alt"></i> Manage Privacy
                        </button>
                    </div>
                </div>

                {/* --- Footer Action Buttons --- */}
                <div className="profile-footer-actions">
                    <button className="btn-cancel">Cancel</button>
                    <button className="btn-save-changes">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;