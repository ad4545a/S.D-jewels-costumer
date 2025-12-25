const isProduction = process.env.NODE_ENV === 'production';
export const API_URL = process.env.REACT_APP_API_URL || (isProduction ? 'https://s-d-jewels-backend.onrender.com/api' : 'http://localhost:5000/api');
