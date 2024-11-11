import React from 'react';
import '../styles/education.css';

const Education = () => {
    return (
        <section className="education" id="education">
            <h2 className="section-title">Education</h2>
            <div className="education-grid">
                <div className="education-item">
                    <h3>Syracuse University</h3>
                    <h4>Master of Science in Applied Data Science</h4>
                    <p className="education-date">Syracuse, NY | Expected May 2024</p>
                    <p>GPA: 3.9/4.0</p>
                </div>

                <div className="education-item">
                    <h3>University of Mumbai</h3>
                    <h4>Bachelor of Engineering in Electronics</h4>
                    <p className="education-date">Mumbai, India | 2015 - 2019</p>
                </div>
            </div>
        </section>
    );
};

export default Education; 