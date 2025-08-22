import React, { useState, useEffect } from "react";
import "./W2W.css";
import logo from "./assets/logo2.png";

function W2W() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("Hollywood");

  const fetchMovies = async (query, pageNum = 1, append = false) => {
    if (!query) return;
    setLoading(true);

    const searchText =
      selectedIndustry === "Bollywood" ? `Bollywood ${query}` : query;

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=91e37f01&s=${searchText}&type=movie&page=${pageNum}`
      );
      const data = await response.json();

      if (data.Search) {
        if (append) {
          setMovies((prev) => [...prev, ...data.Search]);
        } else {
          setMovies(data.Search);
        }

        const total = parseInt(data.totalResults, 10);
        if ((append ? movies.length + data.Search.length : data.Search.length) >= total) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        if (!append) setMovies([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
    setLoading(false);
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies(searchQuery, 1, false);
  };

  // Industry toggle
  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    if (searchQuery) {
      setPage(1);
      fetchMovies(searchQuery, 1, false);
    }
  };

  // Random suggestion button
  const handleSurprise = () => {
    // List of random popular search words
    const suggestions = [
      "Avengers",
      "Titanic",
      "Inception",
      "3 Idiots",
      "Bahubali",
      "Joker",
      "Frozen",
      "Dangal",
      "see you on venus",
      "culpa mia",
      "Beautiful Disaster",
      "Spider-Man",
      "Interstellar"
    ];
    const randomMovie = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSearchQuery(randomMovie);
    setPage(1);
    fetchMovies(randomMovie, 1, false);
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.scrollHeight &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1 && searchQuery) {
      fetchMovies(searchQuery, page, true);
    }
  }, [page]);

  return (
    <div className="app-container">
      <header className="header">
        <img src={logo} alt="logo" className="logo-img" />
        <h1 className="title">What2Watch</h1>
        <p className="subtitle">
          🎬 Confused what to watch? <em>Search or get a random suggestion!</em>
        </p>
      </header>

      {/* Industry Toggle */}
      <div className="categories">
        <label className="radio-label">
          <input
            type="radio"
            name="industry"
            value="Hollywood"
            checked={selectedIndustry === "Hollywood"}
            onChange={() => handleIndustryChange("Hollywood")}
          />
          Hollywood
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="industry"
            value="Bollywood"
            checked={selectedIndustry === "Bollywood"}
            onChange={() => handleIndustryChange("Bollywood")}
          />
          Bollywood
        </label>
      </div>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="surprise-btn">
          🔍 Search
        </button>
      </form>

      {/* Surprise Me Button */}
      <div className="button-container">
        <button className="surprise-btn" onClick={handleSurprise}>
          🎲 Surprise Me!
        </button>
      </div>

      {/* Movies Grid */}
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
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
          !loading && (
            <p className="no-movies">No movies found. Try another search!</p>
          )
        )}
      </div>

      {/* Loading */}
      {loading && <p style={{ marginTop: "20px" }}>Loading more movies...</p>}

      {/* Load More Button */}
      {!loading && hasMore && movies.length > 0 && (
        <div className="button-container">
          <button className="surprise-btn" onClick={() => setPage((prev) => prev + 1)}>
            ⬇️ Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default W2W;
