import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import TranscriptionCard from "../components/TranscriptionCard";
import TranscriptionPage from "../components/TranscriptionPage";
import "./MiddleSection.css";
import { Scrollbars } from "react-custom-scrollbars";
import { FaArrowLeft } from "react-icons/fa";

const MiddleSection = ({ transcriptions, categories, selectedCategory, setSelectedCategory, searchInput, setSearchInput }) => {
    const [trending, setTrending] = useState([]);
    
    const trendingRef = React.createRef();

    useEffect(() => {
        const sortedTrending = [...transcriptions].sort((a, b) => b.saves - a.saves).slice(0, 10);
        setTrending(sortedTrending);
    }, [transcriptions]);

    const renderThumb = ({ style, ...props }) => {
        const thumbStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderRadius: "6px",
        width: "8px",
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    const handleScroll = (direction, ref) => {
        if (ref.current) {
        const { scrollLeft, clientWidth } = ref.current;
        const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
        ref.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
        }
    };

    const filteredTranscriptions = transcriptions.filter(transcription => {
        const matchesCategory = selectedCategory ? transcription.categories.includes(selectedCategory) : true;
        const matchesSearch = searchInput ? transcription.title.toLowerCase().includes(searchInput.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });
    console.log(filteredTranscriptions, selectedCategory)

    return (
        
    <div className="middle-section">

        <div className="middle-container">
        
        {(selectedCategory || searchInput) ? (
            <div style={{height: "100%", overflow: "hidden"}}>
                <div
                    className="icon-container"
                    onClick={() => {
                        setSelectedCategory(null);
                        setSearchInput(null);
                      }} // Reset category to show initial content
                    >
                    <FaArrowLeft title="Back" />
                </div>
            
                <Scrollbars
                    className="scroll-area"
                    autoHide={true}
                    autoHideTimeout={1000}
                    autoHideDuration={300}
                    renderThumbVertical={renderThumb}
                    universal={true}
                    style={{ width: "60vw" }}
                >
                    <div className="filtered-transcriptions">
                    {filteredTranscriptions.map((item) => (
                        <Link to={`/transcription/${item.id}`} key={item.id}>
                        <TranscriptionCard
                            image={item.image_file}
                            title={item.title}
                            likes={item.favorites}
                            saves={item.saves || 0}
                        />
                        </Link>
                    ))}
                </div>
            </Scrollbars>
            </div>
        ) : (
            <Scrollbars
            className="scroll-area"
            autoHide={true}
            autoHideTimeout={1000}
            autoHideDuration={300}
            renderThumbVertical={renderThumb}
            universal={true}
            style={{ width: "60vw" }}
            >
            <div>
                {/* Trending Section */}
                <section className="trending-section">
                <h2>Trending</h2>
                <div className="scroll-container">
                    <button className="scroll-button left" onClick={() => handleScroll("left", trendingRef)}>
                    &lt;
                    </button>
                    <div className="trending-grid" ref={trendingRef}>
                    {trending.map((item) => (
                        <Link to={`/transcription/${item.id}`} key={item.id} style={{ backgroundColor: "transparent" }}>
                        <TranscriptionCard
                            image={item.image_file}
                            title={item.title}
                            likes={item.favorites}
                            saves={item.saves || 0}
                        />
                        </Link>
                    ))}
                    </div>
                    <button className="scroll-button right" onClick={() => handleScroll("right", trendingRef)}>
                    &gt;
                    </button>
                </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                {Object.keys(categories).map((category) => (
                    <div key={category} className="category-row">
                    <div className="category-left">
                        <h3 className="category-title">{category}</h3>
                    </div>
                    <div className="category-cards">
                        {categories[category].map((item) => (
                        <Link to={`/transcription/${item.id}`} key={item.id} style={{ backgroundColor: "transparent" }}>
                            <TranscriptionCard
                            image={item.image_file}
                            title={item.title}
                            likes={item.favorites}
                            saves={item.saves || 0}
                            />
                        </Link>
                        ))}
                    </div>
                    </div>
                ))}
                </section>

                {/* Routes */}
                <Routes>
                <Route path="/transcription/:id" element={<TranscriptionPage />} />
                </Routes>
            </div>
            </Scrollbars>
        )}
        </div>
    </div>
    );
};

export default MiddleSection;

