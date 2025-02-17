import { useAuth0 } from "@auth0/auth0-react";
import '../styles/Header.css';

const Header = () => {

    const { user } = useAuth0();
    const { logout } = useAuth0();
    const { isAuthenticated } = useAuth0();

    return (
        <header>
            <img src={user.picture} alt={user.name} />
            <button className="btnLogout" onClick={() => logout()}> LOGOUT </button>
        </header>
    );
}

export default Header;