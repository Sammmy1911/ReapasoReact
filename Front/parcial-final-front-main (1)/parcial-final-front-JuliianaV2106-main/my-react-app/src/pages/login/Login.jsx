import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { login } from "./services/Login.services";

function Login() {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const session = JSON.parse(localStorage.getItem("postManagerSession") || "null");

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("postManagerSession", JSON.stringify(data));
            navigate("/feed", { replace: true });
        },
        onError: (error) => {
            console.error(error);
        },
    });

    if (session?.token) {
        return <Navigate to="/feed" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setCredentials((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        loginMutation.mutate(credentials);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        p: 4,
                    }}
                >
                    <Stack
                        component="form"
                        spacing={3}
                        onSubmit={handleSubmit}
                    >
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Iniciar sesión
                        </Typography>

                        {loginMutation.isError && (
                            <Alert severity="error">
                                Usuario o contraseña incorrectos.
                            </Alert>
                        )}

                        <TextField
                            label="Usuario"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending
                                ? "Ingresando..."
                                : "Ingresar"}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login;
