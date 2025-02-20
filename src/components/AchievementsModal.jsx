import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AchievementsModal.css";

const steamApiKey = process.env.REACT_APP_STEAM_API_KEY;
const steamId = process.env.REACT_APP_STEAM_ID;

const AchievementsModal = ({ appid, onClose }) => {
    const [achievements, setAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [achievementStats, setAchievementStats] = useState({});


    useEffect(() => {

        const fetchGameAchievements = async () => {
            try {
                const response = await axios.get("https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/", {
                    params: {
                        key: steamApiKey,
                        appid: appid,
                    },
                });

                const data = response.data.game;
                if (data && data.availableGameStats) {
                    setAchievements(data.availableGameStats.achievements);
                }
            } catch (error) {
                console.error("Error obteniendo logros del juego:", error);
            }
        };

        const fetchUserAchievements = async () => {
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
                    setUserAchievements(data.achievements);
                }
            } catch (error) {
                console.error("Error obteniendo logros del usuario:", error);
            }
        };

        const fetchAchievementStats = async () => {
            try {
                const response = await axios.get("https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/", {
                    params: { gameid: appid },
                });

                const stats = response.data.achievementpercentages.achievements.reduce((acc, curr) => {
                    acc[curr.name] = curr.percent;
                    return acc;
                }, {});

                setAchievementStats(stats);
            } catch (error) {
                console.error("Error obteniendo rareza de logros:", error);
            }
        };

        fetchGameAchievements();
        fetchUserAchievements();
        fetchAchievementStats();
    }, [appid]);

    const getBorderColor = (percent) => {
        if (percent > 50) return "#cd7f32";
        if (percent > 25) return "#c0c0c0";
        if (percent > 10) return "#ffd700";
        return "#daf8ff";
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>ACHIEVEMENTS</h2>
                <button className="close-button" onClick={onClose}><span class="material-symbols-outlined">
                    close
                </span></button>

                <div className="achievements-list">
                    {achievements.map((ach) => {
                        const userAch = userAchievements.find((ua) => ua.apiname === ach.name);
                        const isUnlocked = userAch && userAch.achieved === 1;
                        const isHidden = ach.hidden === 1;
                        const rarity = achievementStats[ach.name] || 100;
                        const borderColor = getBorderColor(rarity);

                        return (
                            <div key={ach.name} className={`achievement-item ${isUnlocked ? "unlocked" : "locked"} ${isHidden && !isUnlocked ? "blurred" : ""}`} style={{ borderLeft: `5px solid ${borderColor}` }}>
                                <img
                                    src={ach.icon || "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/default_achievement_icon.jpg"}
                                    alt={ach.displayName}
                                    className={`achievement-icon ${!isUnlocked ? "grayscale" : ""}`}
                                />

                                <div className={`achievement-content ${isHidden && !isUnlocked ? "blurred" : ""}`}>
                                    <strong>{ach.displayName}</strong>
                                    <p>{ach.description}</p>
                                </div>

                                {isHidden && !isUnlocked ? ( <div className="hidden-overlay">Hidden Achievement</div>) : (<></>)}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default AchievementsModal;

