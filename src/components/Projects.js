import React from 'react';
import '../styles/projects.css';
import dashboardImage from '../Images/data_viz/D0_Opening_Dashboard.jpeg';
import emissionsImage from '../Images/data_viz/D1_GHG_Emission.png';
import energyImage from '../Images/data_viz/D2_Energy.png';
import investmentsImage from '../Images/data_viz/D3_Investments.png';
import economicsImage from '../Images/data_viz/D4_Economics.png';

const Projects = ({ onQuickViewClick }) => {
    const projectsData = [
        {
            title: "Green Prosperity: Is Sustainable Energy the Key to National Growth?",
            type: "Data Visualization Project",
            date: "January 2024 - May 2024",
            descriptionPoints: [
                "Analyzed the intersection between sustainable energy adoption and national economic growth using comprehensive data visualization techniques.",
                "Evaluated key factors including global greenhouse gas emissions, renewable energy trends, and clean energy investments.",
                "Created interactive dashboards to demonstrate the collective impact on economic performance and sustainability metrics."
            ],
            githubLink: "https://github.com/sahilbhagat30/Projects/blob/main/Data%20Visualization/Green%20Prosperity/Green%20Prosperity.md",
            slides: [
                {
                    title: "Sustainable Energy Dashboard",
                    img: dashboardImage,
                    description: "Interactive dashboard showing global energy trends"
                },
                {
                    title: "Global GHG Emissions Analysis",
                    img: emissionsImage,
                    description: "Analysis of greenhouse gas emissions trends"
                },
                {
                    title: "Energy Consumption Patterns",
                    img: energyImage,
                    description: "Renewable vs. Non-renewable energy usage patterns"
                },
                {
                    title: "Clean Energy Investments",
                    img: investmentsImage,
                    description: "Global investment trends in sustainable energy"
                },
                {
                    title: "Economic Impact Analysis",
                    img: economicsImage,
                    description: "Correlation between energy adoption and economic growth"
                }
            ],
            tags: ["Tableau", "Data Analysis", "Visualization"]
        },
        {
            title: "Statistical Analysis of Musculoskeletal Symptoms in Divers",
            type: "Healthcare Data Analysis Project",
            date: "August 2019 – May 2020",
            descriptionPoints: [
                "Conducted comprehensive statistical analysis on musculoskeletal symptoms in divers, collaborating with Sion Hospital.",
                "Performed statistical modeling using Python (SciPy, NumPy) to analyze injury patterns and design preventive strategies.",
                "Achieved 40% increase in training efficiency and 60% improvement in recovery rates through data-driven insights."
            ],
            githubLink: "#",
            tags: ["Python", "Tableau", "Excel", "Statistical Analysis"]
        },
        {
            title: "Road Structural Health Monitoring and Analysis",
            type: "IoT-based Project",
            date: "August 2017 – May 2019",
            descriptionPoints: [
                "Developed an IoT-based system for monitoring road structural health across a 2000+ km network.",
                "Applied machine learning algorithms (Random Forest) to predict maintenance requirements, improving assessment accuracy by 30%.",
                "Integrated Google Maps API for geospatial analysis, providing actionable insights for infrastructure planning."
            ],
            githubLink: "#",
            tags: ["Python", "Machine Learning", "Google Maps API", "IoT", "Random Forest"]
        },
        {
            title: "Deep Learning for Gestational Diabetes Prediction",
            type: "Healthcare Machine Learning Project",
            date: "August 2023 – December 2023",
            descriptionPoints: [
                "Developed a deep learning model achieving 97% accuracy in predicting gestational diabetes risk.",
                "Implemented data preprocessing using KNN imputation and feature scaling techniques.",
                "Utilized SHAP analysis for model interpretability, providing clinicians with insights into significant risk factors."
            ],
            githubLink: "#",
            tags: ["Python", "TensorFlow", "Keras", "SHAP", "Deep Learning"]
        }
    ];

    return (
        <div className="section-container" id="projects">
            <h2 className="section-title">Projects</h2>
            {projectsData.map((project, index) => (
                <div className="experience-item" key={index}>
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-details">
                        <h4>{project.type}</h4>
                        <p className="location-date">{project.date}</p>
                    </div>
                    <ul className="project-description">
                        {project.descriptionPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                    <div className="skill-tags">
                        {project.tags.map((tag, tagIndex) => (
                            <span className="tag" key={tagIndex}>{tag}</span>
                        ))}
                    </div>
                    <div className="project-links">
                        <div className="button-group">
                            {project.slides && (
                                <button 
                                    onClick={() => onQuickViewClick(project.slides)} 
                                    className="action-button"
                                >
                                    <span className="transition"></span>
                                    <span className="gradient"></span>
                                    <span className="label">Quick View</span>
                                </button>
                            )}
                            <a 
                                href={project.githubLink}
                                className="action-button github-link" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <span className="transition"></span>
                                <span className="gradient"></span>
                                <span className="label">GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Projects;