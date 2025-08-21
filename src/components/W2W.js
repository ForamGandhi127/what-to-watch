import React, { useState } from "react";
import "./W2W.css";
import logo from "./assets/logo2.png";

const categories = {
  Action: "action",
  Comedy: "comedy",
  Drama: "drama",
  Horror: "horror",
  Romance: "romance",
};

function W2W() {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=91e37f01&s=${category}&type=movie`
      );
      const data = await response.json();
      if (data.Search) {
        setMovies(data.Search.slice(0, 6)); // show 6 movies
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchMovies(category);
  };

  const handleSurprise = () => {
    const categoryList = Object.keys(categories);
    const randomCategory =
      categoryList[Math.floor(Math.random() * categoryList.length)];
    setSelectedCategory(randomCategory);
    fetchMovies(randomCategory);
  };

  return (
    <div className="app-container">
      <header className="header">
        <img src={logo} alt="logo" className="logo-img" />
        <h1 className="title">What2Watch</h1>
        <p className="subtitle">
          🎬 Confused what to watch? <em>Let us decide for you!</em>
        </p>
      </header>

      {/* Category Selection */}
      <div className="categories">
        {Object.keys(categories).map((cat) => (
          <label key={cat} className="radio-label">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={selectedCategory === cat}
              onChange={() => handleCategoryChange(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Surprise Me Button */}
      <div className="button-container">
        <button className="surprise-btn" onClick={handleSurprise}>
          🎲 Surprise Me!
        </button>
      </div>

      {/* Movies */}
      <div className="movies-grid">
        {loading ? (
          <p>Loading...</p>
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-movies">No movies found. Try another category!</p>
        )}
      </div>
    </div>
  );
}

export default W2W;
