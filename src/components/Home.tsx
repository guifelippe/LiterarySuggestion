import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';

const Home: React.FC = () => {
  const [genre, setGenre] = useState<string>('');
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [randomBook, setRandomBook] = useState<{ id: number, title: string, image: string, summary: string, genreId: number } | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:4567/genre')
    .then((response) => setGenres(response.data))
    .catch((error) => alert(`Error when updating genres: ${error}`))
  }, [])

  const getRandomBook = (genreId: number) => {
    if(!genreId){
        setError('Please select a genre.');
        return;
    }

    setError('')

    axios.get(`http://localhost:4567/books/${genreId}`)
    .then((response) => {
        if(response.data.length === 0){
            setError('There are no books available for the selected genre.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomBookInfo = response.data[randomIndex];

        setRandomBook(randomBookInfo)
    })
    .catch((error) => alert(`Error when searching for book: ${error}`))
  };

  return (
    <div className="home">
      <h1>Book Recommender</h1>
      <div>
        <label>Choose a book genre:</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Select a genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => getRandomBook(parseInt(genre))}>Get Recommendation</button>
      {error && <p className="error-message">{error}</p>}
      {randomBook && (
        <div className="book-info">
          <h2>Title: {randomBook.title}</h2>
          <img className="responsive-image" src={randomBook.image} alt={randomBook.title} />
          <p>Summary:<br/> {randomBook.summary}</p>
        </div>
      )}
    </div>
  );
};

export default Home;