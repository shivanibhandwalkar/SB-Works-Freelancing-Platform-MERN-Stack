import socketIoClient from 'socket.io-client';

// Use window.location.hostname so it automatically uses localhost, 
// and point the port directly to your backend server (6001)
const HOST = window.location.hostname || 'localhost';
export const API_URL = `http://${HOST}:6001`;

export const socket = socketIoClient(API_URL);