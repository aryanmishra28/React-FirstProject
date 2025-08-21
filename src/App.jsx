import React, { useEffect, useState } from 'react';
import Search from './components/Search.jsx';

const API_BASE_URL = 'https://imdb236.p.rapidapi.com/api/imdb';

const API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY, // ✅ from .env
    'X-RapidAPI-Host': 'imdb236.p.rapidapi.com',         // ✅ use fixed host
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // If user searches → query by searchTerm
      const endpoint = searchTerm
        ? `${API_BASE_URL}/search?type=movie&title=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/search?type=movie&genre=Drama&rows=10&sortOrder=ASC&sortField=id`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.results || data.results.length === 0) {
        setErrorMessage('No movies found.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results); // ✅ API returns inside `results`

    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero" />
            <h1>
              Find <span className="text-gradient">Movies</span> You Love Watching
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
              {movieList.map((movie, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={movie.imageUrl || movie.primaryImage?.url || "https://via.placeholder.com/300x450?text=No+Image"}
                    alt={movie.title || movie.primaryTitle}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {movie.title || movie.primaryTitle}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                      {movie.description || movie.storyline || "No description available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        </div>
      </div>
    </main>
  );
}

export default App;
