import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/loginButon.css";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="loginContainer">
        <img src="https://brandlogos.net/wp-content/uploads/2018/10/steam-logo-symbol-300x300.png" alt="" />
        <h1>Welcome to the Dragon Launcher</h1>
        <p>You must log in with your steam acount to start</p>
        <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
    
  ); 
};

export default LoginButton;