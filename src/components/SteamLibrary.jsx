import axios from "axios";
import { useState, useEffect, useRef } from "react";
import '../styles/SteamLibrary.css';
import { useNavigate } from "react-router-dom";

const steamApiKey = process.env.REACT_APP_STEAM_API_KEY;
const steamId = process.env.REACT_APP_STEAM_ID;


const getLibrary = async () => {
  try {
    const response = await axios.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/", {
      params: {
        key: steamApiKey,
        steamid: steamId,
        include_appinfo: true,
      },
    });

    return response.data.response.games || [];
  } catch (error) {
    console.error("Error obteniendo biblioteca de Steam:", error);
    return [];
  }
};

const SteamLibrary = ({ showSearch }) => {
  const [games, setGames] = useState([]);
  const [hoveredGame, setHoveredGame] = useState(null);
  const [gameLogo, setGameLogo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();



  useEffect(() => {
    getLibrary().then(setGames);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredGames = games.sort((a, b) => b.rtime_last_played - a.rtime_last_played).filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMouseEnter = async (game) => {
    setHoveredGame(game.appid);

    const logoUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/logo.png`;

    try {
      const response = await fetch(logoUrl);
      if (response.ok) {
        setGameLogo(null);
        setTimeout(() => {
          setGameLogo(logoUrl);
        }, 1);
      } else {
        setGameLogo(null);
      }
    } catch (error) {
      setGameLogo(null);
    }
  };

  const handleGameClick = (appid) => {
    navigate(`/game/${appid}`);
  };

  return (
    <>
      {showSearch && (
        <input
          type="text"
          className="search-input"
          placeholder="Search Games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
      <button className="scroll-button left" onClick={() => scroll("left")}>‹</button>
      <button className="scroll-button right" onClick={() => scroll("right")}>›</button>

      {gameLogo && <img src={gameLogo} alt="Game Logo" className="game-logo" />}

      <div className="gameContainer" ref={scrollRef}>
        {filteredGames.map((game) => {
          const coverUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`;
          const headerUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

          return (
            <div className="game" key={game.appid}
              onMouseEnter={() => handleMouseEnter(game)}
              onClick={() => handleGameClick(game.appid)}
            >
              <img
                src={coverUrl}
                alt={game.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = headerUrl;
                }}
              />
            </div>
          );
        })}

      </div>
      <div className="gameBackground"
        style={{
          backgroundImage: hoveredGame
            ? `url(https://cdn.akamai.steamstatic.com/steam/apps/${hoveredGame}/library_hero.jpg), url(https://cdn.akamai.steamstatic.com/steam/apps/${hoveredGame}/page_bg_generated_v6b.jpg)`
            : "none",
        }}></div>
    </>
  );
};

export default SteamLibrary;

