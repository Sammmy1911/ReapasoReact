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

export const getPosts = async () => {
    const { data } = await postManagerApi.get("/post");
    return data;
};

export const createPost = async (postData) => {
    const { data } = await postManagerApi.post("/post", postData);
    return data;
};

export const getCommentsByPostId = async (postId) => {
    const { data } = await postManagerApi.get(`/post/${postId}/comments`);
    return data;
};

export const addComment = async (postId, commentData) => {
    const { data } = await postManagerApi.post(`/post/${postId}/comments`, commentData);
    return data;
};

export default postManagerApi;