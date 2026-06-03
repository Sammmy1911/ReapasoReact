export const saveSession = (session) => {
    localStorage.setItem("postManagerSession", JSON.stringify(session));
};

export const getSession = () => {
    const session = localStorage.getItem("postManagerSession");
    return session ? JSON.parse(session) : null;
};

export const clearSession = () => {
    localStorage.removeItem("postManagerSession");
};
