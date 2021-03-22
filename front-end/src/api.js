import axios from "axios";
import config from "./config";
import jwt_decode from "jwt-decode";
axios.defaults.baseURL = config.apiUrl;

const token = localStorage.getItem('token');

export const isLogged = () => {
    if (token) {
        var decoded = jwt_decode(token);
        console.log(decoded);
    }
    const headers = {
        "Authorization": "Bearer "+token,
    }
    const requestUrl = '/logged';
    return axios.get(requestUrl, {
        headers: headers,
    });
}

export const getOneUser = (id) => {
    const requestUrl = `/users/${id}`;
    return axios.get(requestUrl);
}

export const login = (params) => {
    const requestUrl = '/token';
    return axios.post(requestUrl, params, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

export const register = (params) => {
    const requestUrl = "/register";
    return axios.post(requestUrl, params, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}