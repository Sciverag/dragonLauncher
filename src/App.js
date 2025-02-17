import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/loginButon';

function App() {

  const { isAuthenticated } = useAuth0();

  return (
    <>
      <main>
        {isAuthenticated ? (<></>) : (<LoginButton/>)}
      </main>

      <div id="background"></div>
    </>
  );
}

export default App;
