import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 可以在这里添加token等
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export default request;