import Register from "./Register"
import axios from "axios";

function App() {
  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true; // for setting cookies through api
  return (
    <Register />
  )
}

export default App;