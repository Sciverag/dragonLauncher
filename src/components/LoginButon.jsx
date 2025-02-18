import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/loginButon.css";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="loginContainer">
        <img src="https://images.freeimages.com/image/previews/816/lunar-year-dragon-frame-png-5691127.png" alt="" />
        <h1>Welcome to the Dragon Launcher</h1>
        <p>You must log in to start</p>
        <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
    
  ); 
};

export default LoginButton;