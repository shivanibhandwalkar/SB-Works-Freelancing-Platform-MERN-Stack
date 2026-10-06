import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socketIoClient from 'socket.io-client';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {

  // Automatically adapt to the correct backend port (6001)
  const WS = 'http://localhost:6001';
  const socket = socketIoClient(WS);

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  
  const login = async () => {
    try {
      const loginInputs = { email, password };
      const res = await axios.post('http://localhost:6001/login', loginInputs);

      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('usertype', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if (res.data.usertype === 'freelancer') {
        navigate('/freelancer');
      } else if (res.data.usertype === 'client') {
        navigate('/client');
      } else if (res.data.usertype === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      alert("login failed!!");
      console.log("Login error:", err.response?.data || err.message);
    }
  }
      
  const register = async () => {
    try {
      // Construct payload directly to ensure state is fresh and captured
      const registerInputs = { username, email, usertype, password };
      
      const res = await axios.post('http://localhost:6001/register', registerInputs);

      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('usertype', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if (res.data.usertype === 'freelancer') {
        navigate('/freelancer');
      } else if (res.data.usertype === 'client') {
        navigate('/client');
      } else if (res.data.usertype === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      alert("registration failed!!");
      console.log("Register error:", err.response?.data || err.message);
    }
  }

  const logout = async () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <GeneralContext.Provider value={{
      socket, login, register, logout, 
      username, setUsername, 
      email, setEmail, 
      password, setPassword, 
      usertype, setUsertype
    }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider;