import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/LoginButon';
import Header from './components/Header';
import SteamLibrary from './components/SteamLibrary';
import { useState } from 'react';

function App() {

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

export default App;
