import React from 'react';

const Navbar = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <a onClick={() => scrollToSection('experience')}>
                        Work Experience
                    </a>
                </li>
                <li>
                    <a onClick={() => scrollToSection('projects')}>
                        Projects
                    </a>
                </li>
                <li>
                    <a onClick={() => scrollToSection('education')}>
                        Education
                    </a>
                </li>
                <li>
                    <a onClick={() => scrollToSection('achievements')}>
                        Extracurricular Activities
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
