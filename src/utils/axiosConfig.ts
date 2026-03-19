import axios from 'axios';

const links = [
    'http://127.0.0.1:8000/api/',
    'http://127.0.0.1:9090/api/',
    'http://api-eqms.bma.edu.ph/api/'
];

const production = links[2];
const testing = links[0];

// Set baseURL depending on the environment
const baseURL = import.meta.env.MODE === 'production' ? production : testing;

const axiosInstance = axios.create({
    baseURL
});

export default axiosInstance;
