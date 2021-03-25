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

export const getPosts = (start, end, how) => {
    let headers = ""
    if (token) {
        var decoded = jwt_decode(token);
        console.log(decoded);
        var userId = decoded.user_id;
        headers = {
            "Authorization": "Bearer "+token,
        }
    }
    else{
        userId = 0
    }
    console.log(userId);
    const requestUrl = how==="all" ? '/posts': `users/${userId}/follows/posts`;
    console.log(start);
    console.log(end);
    const params = {
        "start": start, 
        "end": end,
    }
    return axios.get(requestUrl,
        {
            headers: headers,
            params: params,
        }
    )
}

export const getLikes = (start, end, id, on) => {
    const params = {
        "start": start,
        "end": end,
    }
    let requestUrl = "";
    if (on==="post") {
        requestUrl = `/posts/${id}/likes`;
    }
    else {
        requestUrl = `/comments/${id}/likes`;
    }
    return axios.get(requestUrl, {
        params: params,
    })
}

export const getLikesSample = (id, on) => {
    let requestUrl = "";
    if (on=="post") {
        requestUrl = `/posts/${id}/likes/sample`;
    }
    else {
        requestUrl = `/comments/${id}/likes/sample`;
    }    
    return axios.get(requestUrl);
}

export const getPostsCommentsSample = (postId) => {
    const requestUrl = `posts/${postId}/comments/sample`;
    return axios.get(requestUrl);
}

export const getPostsComments = (start, end, postId) => {
    const params = {
        "start": start,
        "end": end,
    }
    const requestUrl = `/posts/${postId}/comments`;
    return axios.get(requestUrl, {
        params: params,
    })
}

export const getUsers = (start, end) => {
    const requestUrl = "/users";
    const params = {
        "start": start,
        "end": end,
    };
    return axios.get(requestUrl, {
        params: params,
    });
}

export const myLikes = (start, end, userId) => {
    const requestUrl = `users/${userId}/likes`;
    const params = {
        "start": start,
        "end": end,
    }
    return axios.get(requestUrl, {
        params: params,
    })
}

export const getUser = (id) => {
    const requestUrl = `/users/${id}`;
    return axios.get(requestUrl);
}

export const getFollowsCount = (id) => {
    const token = localStorage.getItem('token');
    if (token) {
        var decoded = jwt_decode(token);
        console.log(decoded);
    }
    const headers = {
        "Authorization": "Bearer "+token,
    }

    const requestUrl = `/users/${id}/follows/count`;
    return axios.get(requestUrl, {
        headers: headers
    });
}

export const getFollowersCount = (id) => {
    const token = localStorage.getItem('token');
    if (token) {
        var decoded = jwt_decode(token);
        console.log(decoded);
    }
    const headers = {
        "Authorization": "Bearer "+token,
    }

    const requestUrl = `/users/${id}/followers/count`;
    return axios.get(requestUrl, {
        headers: headers,
    });
}