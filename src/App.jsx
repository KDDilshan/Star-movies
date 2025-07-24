import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { updateSearchCount } from '../appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {

  const [searchTerm,setSearchTerm]=useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');

  useDebounce(() => {
    setDebounceSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query=' ') => {

    setLoading(true);
    setErrorMessage('');

    try{
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if(data.response === 'False') {
        setErrorMessage(data.Error||'No movies found');
        setMovies([]);
        return;
      }
      setMovies(data.results || []);
      updateSearchCount();
      }catch(error){
        console.error("Error fetching movies:", {error});
        setErrorMessage("Failed to fetch movies. Please try again later.");
      }finally {
        setLoading(false);
    }

  }

  useEffect(() => {
      fetchMovies(debounceSearchTerm);
    }, [debounceSearchTerm]);

  return (
    <main>
      <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt='hero banner'/>
            <h1>Find <span className='text-gradient'>movies</span> you will enjoy without the hastle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          <section className='all-movies'>
            <h2 className='mt-[40px]'>All Movies</h2>
            {loading  ?(
              <Spinner />
            ) : errorMessage ? (
              <p className='text-red'>{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
          </section>
        </div>
    </main>
  )
}
export default App
