import axios from "axios";
import config from "./config";

axios.defaults.baseURL = config.apiUrl;

export const isLogged = () => {
    const requestUrl = "/logged";
    return axios.get(requestUrl);
}

export const getOneUser = (id) => {
    const requestUrl = `/users/${id}`;
    return axios.get(requestUrl);
}