import React, { useState } from 'react';
import Search from './components/Search.jsx';

function App() {
 const [searchTerm, setSearchTerm] = useState('');

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero" className="hero-image" />
            <h1>Find <span className="text-gradient">Movies</span> You Love Watching</h1>
            <Search  searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
        </div>
      </div>
    </main>
  )
}

export default App
