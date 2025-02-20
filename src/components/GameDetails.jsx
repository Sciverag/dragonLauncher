import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/GameDetails.css";
import { useAuth0 } from "@auth0/auth0-react";

const steamApiKey = process.env.REACT_APP_STEAM_API_KEY;
const steamId = process.env.REACT_APP_STEAM_ID;

const GameDetails = () => {
    const { appid } = useParams();
    const { isAuthenticated } = useAuth0();
    const [gameDetails, setGameDetails] = useState(null);
    const [playtime, setPlaytime] = useState(null);
    const [achievements, setAchievements] = useState(null);
    const [trophyColor, setTrophyColor] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [detailedDescription, setDetailedDescription] = useState(null);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated){
            const fetchGameDetails = async () => {
                try {
                    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
                    if (response.data[appid].success) {
                        const data = response.data[appid].data;
                        setGameDetails(data);
                        setDetailedDescription(data.detailed_description);
    
                        if (data.movies && data.movies.length > 0) {
                            setTrailerUrl(data.movies[0].webm.max || data.movies[0].mp4.max);
                        }
                    }
                } catch (error) {
                    console.error("Error obteniendo detalles del juego:", error);
                }
            };
    
            const fetchPlaytime = async () => {
                try {
                    const response = await axios.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/", {
                        params: {
                            key: steamApiKey,
                            steamid: steamId,
                            include_appinfo: false,
                        },
                    });
    
                    const games = response.data.response.games || [];
                    const game = games.find((g) => g.appid.toString() === appid);
    
                    if (game) {
                        const minutes = game.playtime_forever || 0;
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        setPlaytime(`${hours}h ${mins}m`);
                    } else {
                        setPlaytime("Never Played");
                    }
                } catch (error) {
                    console.error("Error obteniendo tiempo jugado:", error);
                }
            };
    
            const fetchAchievements = async () => {
                try {
                    const response = await axios.get("https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/", {
                        params: {
                            key: steamApiKey,
                            steamid: steamId,
                            appid: appid,
                        },
                    });
    
                    const data = response.data.playerstats;
    
                    if (data.success) {
                        const totalAchievements = data.achievements.length;
                        const unlockedAchievements = data.achievements.filter((ach) => ach.achieved === 1).length;
    
                        const percentage = (unlockedAchievements / totalAchievements) * 100;
    
                        let newColor = "#cd7f32"; 
                        if (percentage > 25) newColor = "#c0c0c0"; 
                        if (percentage > 50) newColor = "#ffd700"; 
                        if (percentage === 100) newColor = "#daf8ff";
    
                        setTrophyColor(newColor);
    
                        setAchievements({ unlocked: unlockedAchievements, total: totalAchievements });
                    }
                } catch (error) {
                    console.error("Error obteniendo logros:", error);
                }
            };
    
            const checkLogoExists = async () => {
                const url = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`;
    
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        setLogoUrl(url);
                    } else {
                        setLogoUrl(null);
                    }
                } catch {
                    setLogoUrl(null);
                }
            };
    
            fetchGameDetails();
            fetchPlaytime();
            fetchAchievements();
            checkLogoExists();
        }else{
            navigate('/');
        }
        
    }, [appid]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                navigate("/");
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigate]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }

        if (isMuted) {
            document.getElementById("buttonMute").innerText = "volume_up";
        } else {
            document.getElementById("buttonMute").innerText = "volume_off";
        }
    };


    if (!gameDetails) {
        return <p>Loading game details...</p>;
    }

    return (
        <div className="game-details">
            <div
                className="game-background"
                style={{ backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_hero.jpg), url(https://cdn.akamai.steamstatic.com/steam/apps/${appid}/page_bg_generated_v6b.jpg)` }}
            ></div>

            <div
                className="background-gradient"
            ></div>

            {achievements && (
                <div className="achievements">
                    <span style={{ color: trophyColor }} class="material-symbols-outlined">trophy</span> {achievements.unlocked} / {achievements.total}
                </div>
            )}


            <div className="game-info">
                {logoUrl ? (
                    <img src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`} alt={gameDetails.name} className="game-logo-Details" />
                ) : (
                    <h1 className="game-logo-Details">{gameDetails.name}</h1>
                )}
                <div className="game-container">
                    <p>{gameDetails.developers[0]} : <strong>{gameDetails.release_date.date}</strong></p>
                    <p>Time Played: <strong>{playtime}</strong></p>

                    <div className="action-buttons">
                        <a href={`steam://rungameid/${appid}`} className="play-button">Play</a>
                        {achievements && (<button className="icon-button"><span class="material-symbols-outlined">trophy</span></button>)}
                        {trailerUrl && (<button className="icon-button" onClick={toggleMute}><span id="buttonMute" class="material-symbols-outlined">volume_off</span></button>)}
                    </div>

                    <div className="game-description" dangerouslySetInnerHTML={{ __html: detailedDescription }}></div>
                </div>

                <div className="game-trailer">
                    {trailerUrl ? (
                        <video ref={videoRef} muted autoPlay loop className="trailer-video">
                            <source src={trailerUrl} type="video/webm" />
                        </video>
                    ) : (
                        <img src={gameDetails.screenshots ? gameDetails.screenshots[0].path_thumbnail : ""} alt="Screenshot" className="game-screenshot" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetails;


