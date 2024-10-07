import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

const axiosApi = axios.create({
    baseURL: API_URL,
    timeout: 10000,
})

axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default axiosApi;

export async function get(url, params = {}, config = {}) {
    console.log("axios", url);
    return await axiosApi.get(url, { params, ...config }).then(response => response.data)
}

export async function post(
    url,
    data,
    config = {}
) {
    console.log("axios", data)
    return axiosApi.post(url, data, { ...config }).then(response => response.data)
}

export async function put(url, data, config = {}) {
    return axiosApi
        .put(url, data, { ...config })
        .then(response => response.data)
}

export async function patch(url, data, config = {}) {
    return axiosApi
        .patch(url, data, { ...config })
        .then(response => response.data)
}

export async function del(url, config = {}) {
    return await axiosApi
        .delete(url, { ...config })
        .then(response => response.data)
}