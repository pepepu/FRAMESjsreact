import React, { useState, useEffect, useRef } from 'react';
// Re-import Link for navigation
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

// Import your images from the assets folder
import heroImageUrl from '../../assets/images/TUP_Background.jpg';
// import logoIconUrl from '../../assets/images/logo-icon.svg'; // Removed as requested

// ===================================
// --- NEW: Auth Panel Component (*** EDITED ***) ---
// ===================================
const AuthPanel = ({ panel, setPanel }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [step, setStep] = useState(1); // step-by-step control
  const [selectedCourses, setSelectedCourses] = useState([]); // selected courses for step 3
  const [selectedRole, setSelectedRole] = useState(''); // selected role for login/signup
  const [showRoleSelection, setShowRoleSelection] = useState(false); // show role selection for signup
  const signupPanelRef = useRef(null); // scroll container for signup modal

  // Camera capture state/refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [faceCapture, setFaceCapture] = useState(null); // dataURL of captured image
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    tupmYear: '',
    tupmSerial: '',
    email: '',
    contactNumber: '',
    homeAddress: '',
    course: '',
    year: '',
    section: '',
    college: '',
    status: '',
    term: '',
    handledSections: []
  });

  // Available courses for BSIT 4th year
  const availableCourses = [
    { code: "GEC3265", name: "Life and Works of Rizal" },
    { code: "MSTAT52", name: "Statistics and Probability" },
    { code: "ITELEC1", name: "IT Elective 1" },
    { code: "ITELEC2", name: "IT Elective 2" },
    { code: "CSIT401", name: "Capstone Project 1" },
    { code: "CSIT402", name: "Capstone Project 2" },
    { code: "ITPROJ1", name: "IT Project Management" },
    { code: "SYSDES1", name: "Systems Design and Analysis" },
    { code: "NETWORK1", name: "Advanced Networking" },
    { code: "WEBDEV1", name: "Web Development" },
    { code: "MOBILE1", name: "Mobile Application Development" },
    { code: "DBSYS1", name: "Database Systems" },
  ];

  // Example available sections for faculty handled sections checklist
  const availableSections = [
    'BSIT-4A',
    'BSIT-4B',
    'BSIT-4C',
    'BSIT-3A',
    'BSIT-3B',
  ];

  const isLogin = panel === "login";
  const title = isLogin
    ? <>Welcome <span className="auth-title-highlight">Back!</span></>
    : <>Register to your <span className="auth-title-highlight">Class now</span></>;

  const scrollSignupTop = () => {
    if (signupPanelRef.current) {
      signupPanelRef.current.scrollTop = 0;
    }
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
    scrollSignupTop();
  };
  const handleBack = () => {
    setStep((prev) => prev - 1);
    scrollSignupTop();
  };

  const handleCourseToggle = (courseCode) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseCode)) {
        return prev.filter((code) => code !== courseCode);
      } else {
        return [...prev, courseCode];
      }
    });
  };

  const handleSectionToggle = (sectionCode) => {
    setFormData((prev) => {
      const current = prev.handledSections || [];
      const next = current.includes(sectionCode)
        ? current.filter((s) => s !== sectionCode)
        : [...current, sectionCode];
      return { ...prev, handledSections: next };
    });
  };

  const handleFinish = () => {
    // Show alert
    alert('Registration finished, please log in');
    // Close the panel and reset form
    setPanel(null);
    setStep(1);
    setSelectedCourses([]);
    setSelectedRole('');
    setShowRoleSelection(true);
    setFaceCapture(null);
    setFormData({
      firstName: '',
      lastName: '',
      middleInitial: '',
      tupmYear: '',
      tupmSerial: '',
      email: '',
      contactNumber: '',
      homeAddress: '',
      course: '',
      year: '',
      section: '',
      college: '',
      status: '',
      term: '',
      handledSections: []
    });
  };

  // Reset role selection when panel changes
  useEffect(() => {
    if (panel === 'login') {
      setSelectedRole('');
      setShowRoleSelection(false);
    } else if (panel === 'signup') {
      setShowRoleSelection(true);
      setSelectedRole('');
    }
  }, [panel]);

  // Start/stop camera when entering/leaving Step 4 (face capture)
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error('Unable to access camera', err);
      }
    };
    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (!isLogin && !showRoleSelection && step === 4) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      // ensure cleanup when unmounting
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isLogin, showRoleSelection, step]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    setFaceCapture(dataUrl);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  const handleLogin = () => {
    // Check if role is admin and redirect
    if (selectedRole === 'admin') {
      navigate('/admin-dashboard');
      setPanel(null); // Close the panel
    } else {
      // For other roles, you can add their redirects here
      // For now, just close the panel or show a message
      alert('Login functionality for other roles coming soon');
    }
  };

  if (!panel) return null;

  return (
    <>
      {/* Different overlays for Login (slide) vs Signup (modal) */}
      {isLogin ? (
        <>
          {/* Login: Slide-in overlay */}
          <div
            className={`auth-slider-overlay login-overlay ${panel ? 'visible' : ''}`}
            onClick={() => setPanel(null)}
          ></div>
          <div className={`auth-panel login-panel ${panel ? 'visible' : ''}`}>
            <div className="auth-form-container">
              <h2 className="auth-form-title">{title}</h2>
              {/* Login Form */}
              <div className="auth-form-group">
                <label className="auth-form-label" htmlFor="role">Role</label>
                <select 
                  className="auth-form-input" 
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Administrator</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div className="auth-form-group">
                <label className="auth-form-label" htmlFor="email">Email</label>
                <input className="auth-form-input" type="email" id="email" placeholder="example@tup.edu.ph" />
              </div>
              <div className="auth-form-group">
                <label className="auth-form-label" htmlFor="password">Password</label>
                <div className="auth-password-wrapper">
                  <input 
                    className="auth-form-input" 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="••••••••" 
                  />
                  <i 
                    className={`auth-password-icon fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>
              <div className="auth-options-row">
                <label className="auth-checkbox-group">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#forgot" className="auth-forgot-link">Forgot Password?</a>
              </div>
              <button className="auth-submit-button" onClick={handleLogin}>Log In</button>
              <p className="auth-switch-prompt">
                Don't have an account?
                <span onClick={() => setPanel('signup')}>
                  &nbsp;Sign Up
                </span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Signup: Centered Modal Overlay */}
          <div
            className="auth-slider-overlay signup-overlay visible"
            onClick={() => setPanel(null)}
          ></div>
          <div class="signup-overlay visible">
  <div class="signup-panel" ref={signupPanelRef}>
              {showRoleSelection ? (
                <>
                  <h2 className="auth-form-title">Select Your Role</h2>
                  <p className="role-selection-subtitle">Please choose your role to continue</p>
                  <div className="role-cards-grid-auth">
                    <div 
                      className={`role-card-auth admin ${selectedRole === 'admin' ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect('admin')}
                    >
                      <i className="fas fa-user-shield role-icon-auth"></i>
                      <h3>Administrator</h3>
                      <p>Full system control and oversight.</p>
                    </div>
                    <div 
                      className={`role-card-auth faculty ${selectedRole === 'faculty' ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect('faculty')}
                    >
                      <i className="fas fa-chalkboard-teacher role-icon-auth"></i>
                      <h3>Faculty</h3>
                      <p>Access to academic-related features.</p>
                    </div>
                    <div 
                      className={`role-card-auth student ${selectedRole === 'student' ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect('student')}
                    >
                      <i className="fas fa-user-graduate role-icon-auth"></i>
                      <h3>Student</h3>
                      <p>View personal schedules and campus info.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="auth-form-title">{title}</h2>
                  <div className="selected-role-badge">
                    <span>Role: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                    <button 
                      className="change-role-btn" 
                      onClick={() => setShowRoleSelection(true)}
                    >
                      Change
                    </button>
                  </div>
                  {/* Step Indicators */}
                  <div className="signup-step-indicators">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className={`step-circle ${step >= n ? "active" : ""}`}>
                        {n}
                      </div>
                    ))}
                  </div>


              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="signup-step-container">
                  <h3 className="step-title">Step 1: Personal Information</h3>
                  <div className="signup-step">
                    <div className="auth-form-group">
                      <label>First Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="auth-form-group">
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                    <div className="auth-form-group">
                      <label>Middle Initial</label>
                      <input 
                        type="text" 
                        placeholder="M" 
                        maxLength="1"
                        value={formData.middleInitial}
                        onChange={(e) => setFormData({...formData, middleInitial: e.target.value})}
                      />
                    </div>
                    <div className="auth-form-group">
                      <label>TUPM ID Number</label>
                      <div className="tupm-id-wrapper">
                        <span className="tupm-prefix">TUPM -</span>
                        <input 
                          type="text" 
                          placeholder="YY"
                          maxLength="2"
                          value={formData.tupmYear}
                          onChange={(e) => setFormData({...formData, tupmYear: e.target.value})}
                          className="tupm-year-input"
                        />
                        <span className="tupm-sep">-</span>
                        <input 
                          type="text" 
                          placeholder="####"
                          maxLength="4"
                          value={formData.tupmSerial}
                          onChange={(e) => setFormData({...formData, tupmSerial: e.target.value})}
                          className="tupm-serial-input"
                        />
                      </div>
                    </div>
                    <div className="auth-form-group">
                      <label>Birthday</label>
                      <div className="birthday-wrapper">
                        <select className="birthday-select">
                          <option value="">Month</option>
                          <option value="01">January</option>
                          <option value="02">February</option>
                          <option value="03">March</option>
                          <option value="04">April</option>
                          <option value="05">May</option>
                          <option value="06">June</option>
                          <option value="07">July</option>
                          <option value="08">August</option>
                          <option value="09">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                        </select>
                        <input type="number" placeholder="Day" min="1" max="31" className="birthday-input" />
                        <input type="number" placeholder="Year" min="1900" max="2024" className="birthday-input" />
                      </div>
                    </div>
                    <div className="auth-form-group full-width">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="example@tup.edu.ph"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="auth-form-group full-width">
                      <label>Contact Number</label>
                      <input 
                        type="text" 
                        placeholder="09648828868"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      />
                    </div>
                    <div className="auth-form-group full-width">
                      <label>Home Address</label>
                      <input 
                        type="text" 
                        placeholder="Enter your complete home address"
                        value={formData.homeAddress}
                        onChange={(e) => setFormData({...formData, homeAddress: e.target.value})}
                      />
                    </div>
                  </div>
                  <button className="auth-submit-button" onClick={handleNext}>
                    Next
                  </button>
                </div>
              )}

              {/* Step 2: Details (varies by role) */}
              {step === 2 && (
                <div className="signup-step-container">
                  <h3 className="step-title">
                    {selectedRole === 'student' && 'Step 2: Program Student Details'}
                    {selectedRole === 'faculty' && 'Step 2: Faculty Details'}
                    {selectedRole === 'admin' && 'Step 2: Admin Details'}
                  </h3>
                  <div className="signup-step">
                    {selectedRole === 'student' && (
                      <>
                        <div className="auth-form-group full-width">
                          <label>Course</label>
                          <input 
                            type="text" 
                            placeholder="Enter your course"
                            value={formData.course}
                            onChange={(e) => setFormData({...formData, course: e.target.value})}
                          />
                        </div>
                        <div className="auth-form-group">
                          <label>Year</label>
                          <select
                            value={formData.year}
                            onChange={(e) => setFormData({...formData, year: e.target.value})}
                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                            <option value="5">5th Year</option>
                          </select>
                        </div>
                        <div className="auth-form-group">
                          <label>Section</label>
                          <input 
                            type="text" 
                            placeholder="e.g., A, B, C"
                            value={formData.section}
                            onChange={(e) => setFormData({...formData, section: e.target.value})}
                          />
                        </div>
                        <div className="auth-form-group full-width">
                          <label>College</label>
                          <select
                            value={formData.college}
                            onChange={(e) => setFormData({...formData, college: e.target.value})}
                          >
                            <option value="">Select College</option>
                            <option value="CET">College of Engineering and Technology</option>
                            <option value="CAS">College of Arts and Sciences</option>
                            <option value="CIT">College of Industrial Technology</option>
                            <option value="COE">College of Education</option>
                            <option value="COA">College of Architecture</option>
                            <option value="COT">College of Technology</option>
                          </select>
                        </div>
                        <div className="auth-form-group">
                          <label>Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                          >
                            <option value="">Select Status</option>
                            <option value="regular">Regular</option>
                            <option value="irregular">Irregular</option>
                          </select>
                        </div>
                        <div className="auth-form-group">
                          <label>Term</label>
                          <select
                            value={formData.term}
                            onChange={(e) => setFormData({...formData, term: e.target.value})}
                          >
                            <option value="">Select Term</option>
                            <option value="first-sem">First Semester</option>
                            <option value="second-sem">Second Semester</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedRole === 'faculty' && (
                      <>
                        <div className="auth-form-group full-width">
                          <label>Handled Sections</label>
                          <div className="course-list">
                            {availableSections.map((sec) => (
                              <div key={sec} className="course-item">
                                <label className="course-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={(formData.handledSections || []).includes(sec)}
                                    onChange={() => handleSectionToggle(sec)}
                                    className="course-checkbox"
                                  />
                                  <span className="course-name">{sec}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="auth-form-group full-width">
                          <label>College</label>
                          <select
                            value={formData.college}
                            onChange={(e) => setFormData({...formData, college: e.target.value})}
                          >
                            <option value="">Select College</option>
                            <option value="CET">College of Engineering and Technology</option>
                            <option value="CAS">College of Arts and Sciences</option>
                            <option value="CIT">College of Industrial Technology</option>
                            <option value="COE">College of Education</option>
                            <option value="COA">College of Architecture</option>
                            <option value="COT">College of Technology</option>
                          </select>
                        </div>
                        {/* TUPM ID captured in Step 1 */}
                      </>
                    )}

                    {selectedRole === 'admin' && (
                      <>
                        <div className="auth-form-group full-width">
                          <label>College (admin holds)</label>
                          <select
                            value={formData.college}
                            onChange={(e) => setFormData({...formData, college: e.target.value})}
                          >
                            <option value="">Select College</option>
                            <option value="CET">College of Engineering and Technology</option>
                            <option value="CAS">College of Arts and Sciences</option>
                            <option value="CIT">College of Industrial Technology</option>
                            <option value="COE">College of Education</option>
                            <option value="COA">College of Architecture</option>
                            <option value="COT">College of Technology</option>
                          </select>
                        </div>
                        {/* Personal info and TUPM ID captured in Step 1 */}
                      </>
                    )}
                  </div>
                  <div className="step-buttons">
                    <button className="auth-back-button" onClick={handleBack}>Back</button>
                    <button className="auth-submit-button" onClick={handleNext}>Next</button>
                  </div>
                </div>
              )}

              {/* Step 3: Course Assignment (varies by role) */}
              {step === 3 && (
                <div className="signup-step-container">
                  <h3 className="step-title">
                    {selectedRole === 'student' && 'Step 3: Class Registration'}
                    {selectedRole === 'faculty' && 'Step 3: Assign Courses You Handle'}
                    {selectedRole === 'admin' && 'Step 3: Administrative Scope'}
                  </h3>
                  {(selectedRole === 'student' || selectedRole === 'faculty') && (
                    <div className="class-registration-container">
                      {/* Left Column: Available Courses */}
                      <div className="course-pool-column">
                        <h4 className="column-title">Available Courses</h4>
                        <div className="course-list">
                          {availableCourses.map((course) => (
                            <div key={course.code} className="course-item">
                              <label className="course-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={selectedCourses.includes(course.code)}
                                  onChange={() => handleCourseToggle(course.code)}
                                  className="course-checkbox"
                                />
                                <span className="course-code">{course.code}</span>
                                <span className="course-name">{course.name}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Selected */}
                      <div className="my-classes-column">
                        <h4 className="column-title">{selectedRole === 'student' ? 'My Classes' : 'Assigned Courses'}</h4>
                        <div className="selected-courses-list">
                          {selectedCourses.length === 0 ? (
                            <p className="no-selection">No courses selected yet</p>
                          ) : (
                            selectedCourses.map((courseCode) => {
                              const course = availableCourses.find((c) => c.code === courseCode);
                              return (
                                <div key={courseCode} className="selected-course-item">
                                  <span className="selected-course-code">{course.code}</span>
                                  <span className="selected-course-name">{course.name}</span>
                                  <button
                                    className="remove-course-btn"
                                    onClick={() => handleCourseToggle(courseCode)}
                                    title="Remove course"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedRole === 'admin' && (
                    <div className="summary-content">
                      <p>Admins do not register or assign courses at this step. Proceed to continue.</p>
                    </div>
                  )}
                  <div className="step-buttons">
                    <button className="auth-back-button" onClick={handleBack}>Back</button>
                    <button className="auth-submit-button" onClick={handleNext}>Next</button>
                  </div>
                </div>
              )}

              {/* Step 4: Camera Capture (temporary, no DB) */}
              {step === 4 && (
                <div className="signup-step-container">
                  <h3 className="step-title">Step 4: Capture Your Face</h3>
                  <div className="camera-capture-section">
                    <div className="camera-preview">
                      <video ref={videoRef} playsInline muted className="camera-video" />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                    <div className="camera-actions">
                      <button className="auth-submit-button" onClick={handleCapture}>Capture</button>
                      <button className="auth-back-button" onClick={() => setFaceCapture(null)}>Reset</button>
                    </div>
                    {faceCapture && (
                      <div className="captured-preview">
                        <img src={faceCapture} alt="Captured face" className="captured-image" />
                      </div>
                    )}
                  </div>
                  <div className="step-buttons">
                    <button className="auth-back-button" onClick={handleBack}>Back</button>
                    <button className="auth-submit-button" onClick={handleNext} disabled={!faceCapture}>Next</button>
                  </div>
                </div>
              )}

              {/* Step 5: Information Summary & Password Setup */}
              {step === 5 && (
                <div className="signup-step-container">
                  <h3 className="step-title">Step 5: Information Summary & Password Setup</h3>
                  
                  {/* Information Summary */}
                  <div className="summary-section">
                    <h4 className="summary-title">Registration Summary</h4>
                    <div className="summary-content">
                      <div className="summary-item">
                        <span className="summary-label">Name:</span>
                        <span className="summary-value">
                          {formData.firstName || 'N/A'} {formData.middleInitial || ''} {formData.lastName || 'N/A'}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Email Address:</span>
                        <span className="summary-value">{formData.email || 'N/A'}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">TUPM ID:</span>
                        <span className="summary-value">
                          {(formData.tupmYear || formData.tupmSerial)
                            ? `TUPM - ${formData.tupmYear || 'YY'} - ${formData.tupmSerial || '####'}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Role:</span>
                        <span className="summary-value">
                          {selectedRole || 'N/A'}
                        </span>
                      </div>
                      {selectedRole === 'faculty' && (
                        <div className="summary-item">
                          <span className="summary-label">Handled Sections:</span>
                          <div className="summary-courses-list">
                            {(formData.handledSections || []).length === 0 ? (
                              <span className="summary-value">None</span>
                            ) : (
                              <ul className="courses-summary-list">
                                {(formData.handledSections || []).map((sec) => (
                                  <li key={sec} className="course-summary-item">
                                    <span className="course-summary-name">{sec}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                      {(selectedRole === 'student' || selectedRole === 'faculty') && (
                        <div className="summary-item">
                          <span className="summary-label">{selectedRole === 'student' ? 'Selected Courses:' : 'Assigned Courses:'}</span>
                          <div className="summary-courses-list">
                            {selectedCourses.length === 0 ? (
                              <span className="summary-value">No courses selected</span>
                            ) : (
                              <ul className="courses-summary-list">
                                {selectedCourses.map((courseCode) => {
                                  const course = availableCourses.find((c) => c.code === courseCode);
                                  return (
                                    <li key={courseCode} className="course-summary-item">
                                      <span className="course-summary-code">{course.code}</span>
                                      <span className="course-summary-name">{course.name}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="summary-item">
                        <span className="summary-label">Face Capture:</span>
                        <span className="summary-value">{faceCapture ? 'Captured' : 'Not captured'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Password Setup */}
                  <div className="password-setup-section">
                    <h4 className="summary-title">Set Up Password</h4>
                    <div className="signup-step">
                      <div className="auth-form-group full-width">
                        <label>Password</label>
                        <div className="auth-password-wrapper">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                          />
                          <i
                            className={`auth-password-icon fas ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                            onClick={() => setShowPassword(!showPassword)}
                          ></i>
                        </div>
                      </div>
                      <div className="auth-form-group full-width">
                        <label>Retype Password</label>
                        <div className="auth-password-wrapper">
                          <input
                            type={showRetypePassword ? "text" : "password"}
                            placeholder="Retype your password"
                          />
                          <i
                            className={`auth-password-icon fas ${
                              showRetypePassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                            onClick={() => setShowRetypePassword(!showRetypePassword)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="step-buttons">
                    <button className="auth-back-button" onClick={handleBack}>Back</button>
                    <button className="auth-submit-button" onClick={handleFinish} disabled={!faceCapture}>Finish</button>
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};



// ===================================
// --- Header Component ---
// ===================================
const Header = ({ setPanel }) => (
  <header className="header">
    <div className="logo">
      {/* <img src={logoIconUrl} alt="Frames Icon" className="logo-icon" /> */}
      <span>FRAMES</span>
    </div>
    <nav className="nav-links">
      {/* These are now buttons that set the panel state */}
      <button onClick={() => setPanel('login')} className="login-link">Login</button>
      <button onClick={() => setPanel('signup')} className="get-started-button">Get Started</button>
    </nav>
  </header>
);

// ===================================
// --- Hero Section (*** EDITED ***) ---
// ===================================
const HeroSection = () => ( 
  <section className="hero-section" style={{ backgroundImage: `url(${heroImageUrl})` }}>
    <div className="hero-overlay">
      <div className="hero-content">
        <h1 className="hero-title">FRA<span className="hero-title-red">MES</span></h1> {/* EDITED: Added span for 'MES' */}
        <p>
          Revolutionary campus security powered by Raspberry Pi, featuring facial recognition, gesture control, and Real-time monitoring for a safer, smarter educational environment.
        </p>
        <div className="cta-buttons">
          <Link to="/select-role" className="cta-primary">
            <i className="fas fa-lock"></i> Access Portal
          </Link>
          <button className="cta-secondary">
            <i className="fas fa-play-circle"></i> Watch Demo
          </button>
        </div>
      </div>
    </div>
  </section>
);

// ===================================
// --- Features Section ---
// ===================================
const FeatureCard = ({ iconClass, title, description }) => (
    <div className="feature-card">
      <div className="icon-container">
        <i className={iconClass}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
  
const FeaturesSection = () => (
    <section className="features-section">
      <h2>Advanced Features for Campus Security</h2>
      <p className="features-subtitle">
        Our comprehensive system combines cutting-edge AI technology with reliable hardware to deliver unparalleled campus monitoring and access control capabilities.
      </p>
      <div className="features-grid">
        <FeatureCard 
          iconClass="fas fa-user-shield" 
          title="Facial Recognition" 
          description="Advanced AI-powered facial recognition for secure access control and automated attendance tracking across campus facilities."
        />
        <FeatureCard 
          iconClass="fas fa-hand-paper" 
          title="Gesture Control" 
          description="Intuitive hand gesture controls for contactless interaction with campus systems, enhancing hygiene and user experience."
        />
        <FeatureCard 
          iconClass="fas fa-video" 
          title="Real-time Monitoring" 
          description="Continuous surveillance and monitoring of campus activities with instant alerts and comprehensive security coverage."
        />
        <FeatureCard 
          iconClass="fas fa-bell" 
          title="Emergency Alerts" 
          description="Instant emergency notification system with automated threat detection and rapid response coordination capabilities."
        />
      </div>
    </section>
  );

// ===================================
// --- Main Landing Page ---
// ===================================
const LandingPage = () => {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <div className="landing-page">
      <Header setPanel={setActivePanel} />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <AuthPanel panel={activePanel} setPanel={setActivePanel} />
    </div>
  );
};

export default LandingPage;

