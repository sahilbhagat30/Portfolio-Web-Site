import React from 'react';
import '../styles/experience.css';

const Experience = () => {
    return (
        <div className="section-container" id="experience">
            <h2 className="section-title">Work Experience</h2>
            
            <div className="experience-item">
                <h3 className="company">
                    <a href="https://www.un.org/" target="_blank" rel="noopener noreferrer">
                        United Nations
                    </a>
                </h3>
                <div className="job-details">
                    <h4>Data Science Intern</h4>
                    <p className="location-date">New York City, USA | June 2023 - August 2023</p>
                </div>
                <ul className="achievements">
                    <li>Improved decision-making and resource allocation in 193 countries by analyzing healthcare data, contributing to more effective policy adjustments.</li>
                    <li>Enhanced efficiency by reducing report generation time by 20% through workflow optimizations and streamlining data reporting processes.</li>
                    <li>Delivered actionable insights by developing data visualizations and collaborating with cross-functional teams, resulting in better-informed healthcare project outcomes.</li>
                </ul>
                <div className="skill-tags">
                    <span className="tag">Data Analysis</span>
                    <span className="tag">Visualization</span>
                    <span className="tag">Healthcare</span>
                </div>
            </div>

            <div className="experience-item">
                <h3 className="company">
                    <a href="https://www.capgemini.com/" target="_blank" rel="noopener noreferrer">
                        Capgemini
                    </a>
                </h3>
                <div className="job-details">
                    <h4>Data Analysis and Integration Specialist – North America</h4>
                    <p className="location-date">Mumbai, India | August 2019 - December 2022</p>
                </div>
                <ul className="achievements">
                    <li>Directed data integration initiatives across healthcare and manufacturing, achieving a 20% revenue increase, by leveraging Boomi for ETL processes and employing Python script for data analysis and automation.</li>
                    <li>Conceptualized over 100+ Boomi integration processes, significantly improving data integrity and consistency, by utilizing Python and SQL for precise data cleaning, validation, and integration with key ERP and cloud systems.</li>
                    <li>Designed NetSuite data reporting by developing Tableau dashboards, enhancing decision-making accuracy by 15% in scenarios like integrating NetSuite financial data with Salesforce CRM for a more comprehensive customer and financial analytics view.</li>
                </ul>
                <div className="skill-tags">
                    <span className="tag">Data Integration</span>
                    <span className="tag">ETL</span>
                    <span className="tag">Python</span>
                    <span className="tag">SQL</span>
                    <span className="tag">Tableau</span>
                </div>
            </div>

            <div className="experience-item">
                <h3 className="company">
                    <a href="https://www.tcs.com/" target="_blank" rel="noopener noreferrer">
                        Tata Consultancy Services (TCS)
                    </a>
                </h3>
                <div className="job-details">
                    <h4>Data/Business Analyst Intern</h4>
                    <p className="location-date">Pune, India | May 2018 – July 2018</p>
                </div>
                <ul className="achievements">
                    <li>Developed a resource management dashboard for a Japanese autonomous vehicle company using Tableau, tracking key metrics like resource allocation and expenses, enhancing project visibility for better decision-making.</li>
                    <li>Created Python scripts to semi-automate ground-truth generation for self-driving car datasets, reducing manual data labeling efforts by 15% through Pandas and NumPy implementations.</li>
                    <li>Streamlined resource allocation processes and improved data quality for autonomous vehicle projects, contributing to more efficient workforce planning and reliable self-driving technologies.</li>
                </ul>
                <div className="skill-tags">
                    <span className="tag">Tableau</span>
                    <span className="tag">Python</span>
                    <span className="tag">Data Analysis</span>
                    <span className="tag">ASP.NET</span>
                    <span className="tag">Project Management</span>
                </div>
            </div>
        </div>
    );
};

export default Experience; 