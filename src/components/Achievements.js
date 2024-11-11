import React from 'react';
import '../styles/keyAchievements.css';

const Extracurricular = () => {
    const activities = [
        {
            id: 1,
            title: "Dell Boomi - Capgemini Hackathon 2021",
            position: "1st Runner-up",
            project: "Restaurant Management System with OCR Integration",
            description: [
                "Competed in and secured 1st Runner-up in the Dell Boomi - Capgemini Hackathon.",
                "Designed a comprehensive restaurant management system, automating key processes such as order tracking, billing, and inventory management.",
                "Implemented an OCR system to harmonize transactional data into ERP, streamlining business operations and reducing manual errors."
            ],
            tags: ["OCR", "ERP Integration", "Process Automation"]
        },
        {
            id: 2,
            title: "TCS EngiNX IoT Challenge 2017",
            position: "Finalist",
            project: "Vehicular Health Monitoring System",
            description: [
                "Selected as a Finalist from over 7000 teams for the Vehicular Health Monitoring project.",
                "Secured a one-lakh-rupee grant for prototype development and earned an internship opportunity at Tata Consultancy Services (TCS).",
                "Designed an IoT-based system for monitoring vehicular health, providing insights into maintenance needs and enhancing vehicle safety."
            ],
            tags: ["IoT", "Vehicle Monitoring", "Prototype Development"]
        },
        {
            id: 3,
            title: "ACCS ARM Design Challenge 2017",
            position: "Finalist",
            project: "Autonomous Track Navigation Using Sensor Fusion",
            description: [
                "Competed in the ACCS ARM Design Challenge, developing an autonomous vehicle capable of navigating a track by fusing sensor data and computer vision.",
                "Leveraged data preprocessing and perception techniques, showcasing strong expertise in sensor fusion and computer vision for autonomous systems."
            ],
            tags: ["Sensor Fusion", "Computer Vision", "Autonomous Systems"]
        },
        {
            id: 4,
            title: "SPRAC Technical Leadership",
            position: "Technical Team Leader",
            project: "Robotics and Design Optimization for ABU-Robocon",
            description: [
                "Led a 30-member interdisciplinary team to design robotic models for ABU-Robocon, showcasing advanced robotics innovations on an international stage.",
                "Applied data-driven strategies to optimize design, fostered team collaboration, and promoted innovative approaches for competitive robotics."
            ],
            tags: ["Team Leadership", "Robotics", "Design Optimization"]
        },
        {
            id: 5,
            title: "TUCK and DIVE Photography",
            position: "Official Sports Photographer",
            project: "National-Level Competitions Photography",
            description: [
                "Captured national-level diving competitions, visually documenting key moments for India's premier diving community.",
                "Executed post-production editing using Adobe Photoshop, Lightroom, and Premiere Pro, enhancing the quality and storytelling of event visuals."
            ],
            tags: ["Photography", "Adobe Creative Suite", "Visual Storytelling"]
        }
    ];

    return (
        <section className="extracurricular" id="achievements">
            <h2 className="section-title">Extracurricular Activities</h2>
            <div className="activities-container">
                {activities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                        <div className="activity-header">
                            <h3 className="activity-title">{activity.title}</h3>
                            <span className="position-badge">{activity.position}</span>
                        </div>
                        <h4 className="project-name">{activity.project}</h4>
                        <ul className="activity-description">
                            {activity.description.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                        <div className="skill-tags">
                            {activity.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Extracurricular;