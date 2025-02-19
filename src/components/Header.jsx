import { useAuth0 } from "@auth0/auth0-react";
import '../styles/Header.css';
import { useState } from "react";

const Header = ({ setShowSearch }) => {

    const { user } = useAuth0();
    const { logout } = useAuth0();
    const [orderIcon, setOrder] = useState("menu");

    const changeOrder= () => {
        if(orderIcon == "cards"){
            setOrder("menu")
        }else{
            setOrder("cards")
        }

        document.getElementById("orderIcon").innerText = orderIcon;
    }

    return (
        <header>
            <img src={user.picture} alt={user.name} />
            <div>
                <button onClick={changeOrder}>
                    <span id="orderIcon" className="material-symbols-outlined">
                        cards
                    </span>
                </button>

                <button  onClick={() => setShowSearch((prev) => !prev)}>
                    <span className="material-symbols-outlined">
                        manage_search
                    </span>
                </button>
            </div>
            <button className="btnLogout" onClick={() => logout()}> LOGOUT </button>
        </header>
    );
}

export default Header;