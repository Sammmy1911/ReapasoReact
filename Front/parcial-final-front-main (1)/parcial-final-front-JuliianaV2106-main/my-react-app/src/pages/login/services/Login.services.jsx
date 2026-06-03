import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080/post-manager";

const postManagerApi = axios.create({
    baseURL: API_BASE_URL,
});

postManagerApi.interceptors.request.use((config) => {
    const session = JSON.parse(
        localStorage.getItem("postManagerSession") || "null"
    );

    if (session?.token) {
        config.headers.Authorization =
            `Bearer ${session.token}`;
    }

    return config;
});

export const login = async (credentials) => {
    const { data } = await postManagerApi.post(
        "/login",
        credentials
    );

    return data;
};

export default postManagerApi;