import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameDetails from "./components/GameDetails";
import Menu from './components/Menu';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/game/:appid" element={<GameDetails />} />
      </Routes>
    </Router>
  );
}

export default App;