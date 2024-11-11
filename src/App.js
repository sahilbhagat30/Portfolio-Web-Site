import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Modal from './components/Modal';
import Achievements from './components/Achievements';
import './style.css';
import './styles/contactLinks.css';
import profilePicture from './Images/profile_picture/ProfilePicture.png';
import resume from './docs/Sahil_Bhagat_Resume.pdf';  // Add this import

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSlides, setModalSlides] = useState([]);

    const handleQuickView = (slides) => {
        console.log('Quick View clicked with slides:', slides); // Debug log
        setModalSlides(slides);
        setIsModalOpen(true);
    };

    return (
        <div className="app">
            <Navbar />
            <div className="container">
                <div className="left-panel">
                    <div className="profile-section">
                        <div className="profile-image-container">
                            <img src={profilePicture} alt="Sahil Bhagat" />
                        </div>
                        <h1 className="name">Sahil Bhagat</h1>
                        <p className="tagline">
                            Transforming complex data into actionable insights to drive impactful decisions and foster innovation across industries.
                        </p>
                    </div>

                        {/* New Summary Section */}
                        <div className="summary-section">
                            <div className="expertise-area">
                                <h3>Core Expertise</h3>
                                <ul>
                                    <li>Data Science & Analytics</li>
                                    <li>Machine Learning</li>
                                    <li>Data Visualization</li>
                                    <li>Statistical Analysis</li>
                                </ul>
                            </div>

                            {/* <div className="tech-stack">
                                <h3>Tech Stack</h3>
                                <ul className="tech-list">
                                    <li>Python</li>
                                    <li>Tableau</li>
                                    <li>SQL</li>
                                    <li>TensorFlow</li>
                                    <li>Pandas</li>
                                </ul>
                            </div> */}

                            <div className="quick-stats">
                                <h3>At a Glance</h3>
                                <ul>
                                    <li>3+ Years Experience</li>
                                    <li>10+ Data Projects</li>
                                    <li>3 Industries</li>
                                    <li>GPA: 3.9/4.0</li>
                                </ul>
                            </div>
                        <a 
                            href={resume}
                            className="resume-button button-85"
                            target="_blank" 
                            rel="noopener noreferrer"
                            role="button"
                        >
                            RESUME
                        </a>
                        
                    </div>
                    <div className="contact-links">
                        <ul className="example-2">
                            <li className="icon-content">
                                <a
                                    href="mailto:sbhaga01@syr.edu"
                                    aria-label="Email"
                                    data-social="email"
                                >
                                    <div className="filled"></div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                    </svg>
                                </a>
                                <div className="tooltip">Email</div>
                            </li>
                            <li className="icon-content">
                                <a
                                    href="https://www.linkedin.com/in/sahil-sanjay-bhagat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    data-social="linkedin"
                                >
                                    <div className="filled"></div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                                    </svg>
                                </a>
                                <div className="tooltip">LinkedIn</div>
                            </li>
                            <li className="icon-content">
                                <a
                                    href="https://github.com/sahilbhagat30"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    data-social="github"
                                >
                                    <div className="filled"></div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                                    </svg>
                                </a>
                                <div className="tooltip">GitHub</div>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="right-panel">
                    <Experience />
                    <Projects onQuickViewClick={handleQuickView} />
                    <Education />
                    <Achievements />
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                slides={modalSlides}
            />
        </div>
    );
};

export default App;
