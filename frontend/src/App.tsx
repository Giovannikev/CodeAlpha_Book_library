import Home from './pages/home';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header';
import BookDetailPage from './pages/bookDetailPage';
import Books from './pages/books';
import BorrowedBooks from './components/borrowedBooks';
import { SparklesCore } from './components/ui/Sparkles';
import { useTheme } from './components/themeProvider';

function App() {
  const { theme } = useTheme();
  console.log('theme', theme);

  return (
    <>
      <div className="h-full max-w-full overflow-hidden absolute inset-0 z-0">
        <SparklesCore
          minSize={0.6}
          maxSize={1.4}
          particleDensity={400}
          className="w-full h-full"
          particleColor={
            theme === 'dark' || theme === 'system' ? '#fff' : '#000'
          }
        />
      </div>
      <div className="relative">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/borrowed" element={<BorrowedBooks />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
