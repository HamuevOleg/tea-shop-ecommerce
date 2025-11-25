import React from 'react';
import './TeaStory.css'; // Сейчас создадим и CSS для него

const TeaStory: React.FC = () => {
    return (
        <div className="tea-story-container">
            <div className="story-hero">
                <h1>Искусство Чая</h1>
                <p>Путешествие от листа до чашки</p>
            </div>

            <div className="story-section">
                <div className="story-text">
                    <h2>Древние традиции</h2>
                    <p>
                        Чай — это не просто напиток, это культура, которая объединяет людей на протяжении тысячелетий.
                        В нашем магазине мы чтим традиции сбора и заваривания, чтобы вы могли насладиться истинным вкусом.
                    </p>
                    <p>
                        Каждый сорт чая имеет свой уникальный характер, зависящий от терруара, времени сбора и способа обработки.
                    </p>
                </div>
                {/* Можешь потом заменить src на реальную картинку из папки public или URL */}
                <div className="story-image">
                    <img src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1000&auto=format&fit=crop" alt="Чайная церемония" />
                </div>
            </div>

            <div className="story-section reverse">
                <div className="story-text">
                    <h2>Наш подход</h2>
                    <p>
                        Мы отбираем только лучшие листья с плантаций Китая, Индии и Шри-Ланки.
                        Мы верим, что правильный чай способен подарить гармонию и ясность ума.
                    </p>
                </div>
                <div className="story-image">
                    <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop" alt="Листья чая" />
                </div>
            </div>
        </div>
    );
};

export default TeaStory;