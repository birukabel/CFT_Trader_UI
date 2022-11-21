import './App.css';
import { Main } from './Components/Main';
import {useToken} from './Utilities/UseToken';
import { Login } from "./Components/Login";

function App() {
  const {token, setToken}=useToken();
  if(!token){
    return <Login setToken={setToken}/>
  }
  /*if(!localStorage.getItem("userToken"))
  {
    return <Login setToken={setToken}/>
  }*/

  /*(function () {
    if(!localStorage.getItem("userToken"))
    {   
      return <Login setToken={null}/>
    }
  })();*/

  return (
    <div className="App">
      <Main setToken={setToken}/>
    </div>
  );
}
export default App;
