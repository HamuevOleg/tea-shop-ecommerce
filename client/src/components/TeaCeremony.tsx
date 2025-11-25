import React from 'react';
import './TeaCeremony.css';

const TeaCeremony: React.FC = () => {
    return (
        <div className="tea-ceremony-container">
            <div className="ceremony-hero">
                <h1>The Tea Ceremony</h1>
                <p>Master the Ancient Art of Brewing</p>
            </div>

            <div className="ceremony-intro">
                <p>
                    Brewing tea is a meditative practice that connects us to centuries of tradition.
                    The perfect cup requires attention, patience, and respect for the leaves.
                    Follow these time-honored steps to unlock the full potential of your tea.
                </p>
            </div>

            <div className="brewing-steps">
                <h2>How to Brew the Perfect Cup</h2>

                <div className="step-card">
                    <div className="step-number">1</div>
                    <div className="step-content">
                        <h3>Warm Your Vessel</h3>
                        <p>
                            Rinse your teapot or gaiwan with hot water to awaken the clay and prepare it for brewing.
                            This step ensures even heat distribution and enhances the tea's aroma.
                        </p>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">2</div>
                    <div className="step-content">
                        <h3>Measure the Leaves</h3>
                        <p>
                            Use approximately 5-7 grams of tea per 100ml of water. For a stronger brew, add more leaves rather than increasing steeping time.
                            Quality tea leaves can be infused multiple times.
                        </p>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">3</div>
                    <div className="step-content">
                        <h3>Water Temperature</h3>
                        <p>
                            Different teas require different temperatures:
                        </p>
                        <ul>
                            <li><strong>Green Tea:</strong> 75-80°C (167-176°F)</li>
                            <li><strong>White Tea:</strong> 80-85°C (176-185°F)</li>
                            <li><strong>Oolong Tea:</strong> 85-95°C (185-203°F)</li>
                            <li><strong>Black Tea:</strong> 95-100°C (203-212°F)</li>
                            <li><strong>Pu-erh Tea:</strong> 95-100°C (203-212°F)</li>
                        </ul>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">4</div>
                    <div className="step-content">
                        <h3>The First Rinse</h3>
                        <p>
                            Pour hot water over the leaves and immediately discard after 3-5 seconds.
                            This "awakens" the tea leaves, removes any dust, and prepares them for optimal infusion.
                        </p>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">5</div>
                    <div className="step-content">
                        <h3>First Infusion</h3>
                        <p>
                            Steep for 20-30 seconds for the first brewing. Pour out completely to prevent over-brewing.
                            The first infusion introduces you to the tea's character—light, delicate, and aromatic.
                        </p>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">6</div>
                    <div className="step-content">
                        <h3>Multiple Infusions</h3>
                        <p>
                            Premium tea can be steeped 5-10 times or more. With each infusion, the tea reveals new layers of flavor.
                            Increase steeping time by 10-15 seconds with each subsequent brewing.
                        </p>
                    </div>
                </div>

                <div className="step-card">
                    <div className="step-number">7</div>
                    <div className="step-content">
                        <h3>Mindful Sipping</h3>
                        <p>
                            Take a moment to appreciate the aroma before each sip. Notice how the color deepens,
                            the flavors evolve, and the body changes with each infusion. This is the true art of tea—presence and awareness.
                        </p>
                    </div>
                </div>
            </div>

            <div className="ceremony-footer">
                <blockquote>
                    "Tea is more than a drink; it is a moment of peace, a conversation with nature, and a connection to tradition."
                </blockquote>
            </div>
        </div>
    );
};

export default TeaCeremony;