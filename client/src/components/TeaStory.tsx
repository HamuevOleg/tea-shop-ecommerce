import React from 'react';
import './TeaStory.css';

const TeaStory: React.FC = () => {
    return (
        <div className="tea-story-container">
            <div className="story-hero">
                <h1>The Art of Tea</h1>
                <p>A Journey from Leaf to Cup</p>
            </div>

            <div className="story-section">
                <div className="story-text">
                    <h2>Ancient Traditions</h2>
                    <p>
                        Tea is not just a beverage—it's a culture that has united people for millennia.
                        At YunnanSoul, we honor the traditions of harvesting and brewing to bring you the authentic taste of premium artisan tea.
                    </p>
                    <p>
                        Each tea variety has its own unique character, shaped by terroir, harvest timing, and processing methods.
                        From the misty mountains of Yunnan to your teacup, every leaf tells a story.
                    </p>
                </div>
                <div className="story-image">
                    <img src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1000&auto=format&fit=crop" alt="Tea Ceremony" />
                </div>
            </div>

            <div className="story-section reverse">
                <div className="story-text">
                    <h2>Our Philosophy</h2>
                    <p>
                        We carefully select only the finest leaves from ancient tea gardens in China, India, and Sri Lanka.
                        We believe that the right tea can bring harmony, clarity of mind, and a moment of peace in your day.
                    </p>
                    <p>
                        Our commitment is to sustainable sourcing and preserving traditional cultivation methods that have been passed down through generations of tea masters.
                    </p>
                </div>
                <div className="story-image">
                    <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop" alt="Tea Leaves" />
                </div>
            </div>
        </div>
    );
};

export default TeaStory;