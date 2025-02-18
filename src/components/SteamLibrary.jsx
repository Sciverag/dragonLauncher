import axios from "axios";
import { useState, useEffect } from "react";
import '../styles/SteamLibrary.css';

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

const SteamLibrary = () => {
  const [games, setGames] = useState([]);
  const [hoveredGame, setHoveredGame] = useState(null); 


  useEffect(() => {
    getLibrary().then(setGames);
  }, []);

  return (
      <div className="gameContainer">
        {games.map((game) => {
          const coverUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`;
          const headerUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

          return (
            <div className="game" key={game.appid} 
            onMouseEnter={() => setHoveredGame(game.appid)}
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
        <div className="gameBackground"
        style={{
            backgroundImage: hoveredGame
              ? `url(https://cdn.akamai.steamstatic.com/steam/apps/${hoveredGame}/library_hero.jpg), url(https://cdn.akamai.steamstatic.com/steam/apps/${hoveredGame}/page_bg_generated_v6b.jpg)`
              : "none",
          }}></div>
      </div>
  );
};

export default SteamLibrary;

