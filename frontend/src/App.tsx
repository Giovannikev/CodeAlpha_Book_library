import Home from './pages/home';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header';
import { useState } from 'react';
import AddBook from './pages/addBook';
import BookDetailPage from './pages/bookDetailPage';
import Books from './pages/books';
import BorrowedBooks from './components/borrowedBooks';
import { SparklesCore } from './components/ui/Sparkles';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  return (
    <>
      <div className="h-full max-w-full overflow-hidden absolute inset-0 z-0">
        <SparklesCore
          minSize={0.6}
          maxSize={1.4}
          particleDensity={400}
          className="w-full h-full"
          particleColor={isDarkMode ? '#fff' : '#000'}
        />
      </div>
      <div className="relative">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/borrowed" element={<BorrowedBooks />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
