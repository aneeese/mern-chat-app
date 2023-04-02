import axios from "axios";
import { useState } from "react";

export default function Register() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function register(event) {
    event.preventDefault();
    axios.post("/register", { username, password });
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form onSubmit={register} className="w-64 mx-auto mb-12">
        <input
          value={username}
          onChange={(event) => setUserName(event.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          Register
        </button>
      </form>
    </div>
  );
}
