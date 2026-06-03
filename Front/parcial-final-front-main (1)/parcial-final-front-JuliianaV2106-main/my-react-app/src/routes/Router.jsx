import { createBrowserRouter, Navigate } from "react-router";

import ComponentsPage from "../pages/ComponentsPage";
import Login from "../pages/login/Login";
import FeedPage from "../pages/feed/FeedPage";
import PostPage from "../pages/post/PostPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/feed" replace />
    },
    {
        path: "/feed",
        element: <FeedPage />
    },
    {
        path: "/post/:id",
        element: <PostPage />
    },
    {
        path: "/components",
        element: <ComponentsPage />
    },
    {
        path: "/auth",
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: "login",
                element: <Login />,
            },
        ]
    },
], { basename: "/compu2/front" });

export default router;
