import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!isOpen || !slides || slides.length === 0) return null;

    const handlePrevious = () => {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
    };

    const handleNext = () => {
        setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                
                <h3 className="slide-title">{slides[currentSlide].title}</h3>
                
                <div className="slide-content">
                    <img 
                        src={slides[currentSlide].img} 
                        alt={slides[currentSlide].title}
                    />
                    <p className="slide-description">{slides[currentSlide].description}</p>
                </div>

                {slides.length > 1 && (
                    <div className="slide-navigation">
                        <button 
                            className="nav-button prev"
                            onClick={handlePrevious}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span className="slide-counter">
                            {currentSlide + 1} / {slides.length}
                        </span>
                        <button 
                            className="nav-button next"
                            onClick={handleNext}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;