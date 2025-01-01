
import axios from "axios";
import { message } from 'antd'
// 创建 axios 请求实例
const serviceAxios = axios.create({
  baseURL: "http://localhost:8080", // 基础请求地址
  timeout: 10000, // 请求超时设置
  withCredentials: false, // 跨域请求是否需要携带 cookie
});

// 创建请求拦截
serviceAxios.interceptors.request.use(
  (config) => {
    // 如果开启 token 认证
    // if (false) {
    //   config.headers["Authorization"] = localStorage.getItem("token"); // 请求头携带 token
    // }
    // 设置请求头
    if (!config.headers["content-type"]) { // 如果没有设置请求头
    
      config.headers["content-type"] = "application/json"; // 默认类型
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 创建响应拦截
serviceAxios.interceptors.response.use(
  (res) => {
    const { data } = res;
    // 处理自己的业务逻辑，比如判断 token 是否过期等等
    // 代码块
    return data;
  },
  (error) => {
    console.log(error.response.data.data.msg);
    message.warning(error.response.data.data.msg);
    return Promise.reject(error.response.data.data.msg);
  }
);

export default serviceAxios;