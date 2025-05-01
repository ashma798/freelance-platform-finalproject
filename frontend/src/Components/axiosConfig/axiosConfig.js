import axios from 'axios';
const token = localStorage.getItem('@token');
const axiosInstance = axios.create({
    baseURL: 'https://freelance-platform-finalproject.onrender.com/api',
 //baseURL: 'http://localhost:5000/api',
    timeout: 5000,
        headers: {
           'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
        }
});
export default axiosInstance;
