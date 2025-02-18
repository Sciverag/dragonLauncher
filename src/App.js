import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/LoginButon';
import Header from './components/Header';
import SteamLibrary from './components/SteamLibrary';

function App() {

  const { isAuthenticated } = useAuth0();

  return (
    <>
      <main>
        {isAuthenticated ? (<>
        <Header/>
        <SteamLibrary/>
        </>) : (<LoginButton/>)}
      </main>

      <div id="background"></div>
    </>
  );
}

export default App;
