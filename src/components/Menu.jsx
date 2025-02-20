import '../App.css';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButon';
import Header from './Header';
import SteamLibrary from './SteamLibrary';
import { useState } from 'react';

function Menu() {

  const { isAuthenticated } = useAuth0();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <main>
        {isAuthenticated ? (<>
        <Header setShowSearch={setShowSearch} />
        <SteamLibrary showSearch={showSearch}/>
        </>) : (<LoginButton/>)}
      </main>

      <div id="background"></div>
    </>
  );
}

export default Menu;