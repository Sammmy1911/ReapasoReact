import {
    Container,
    Stack,
    CircularProgress,
    Alert,
    Box,
    Typography
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";

import UserCard from "../../components/UserCard";
import UserPostForm from "../../components/UserPostForm";
import Post from "../../components/Post";
import { getPosts, createPost } from "./services/FeedServices";

/**
 * FeedPage: Componente principal que muestra el muro de publicaciones.
 * Maneja la visualización de posts, la creación de nuevos posts y la información del usuario.
 */
function FeedPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    // Recuperamos la sesión guardada en el localStorage (token, nombre, etc.)
    const session = JSON.parse(localStorage.getItem("postManagerSession") || "null");

    /**
     * useQuery: Hook de React Query para obtener los posts del servidor.
     * queryKey: Identificador único para la caché de esta consulta.
     * queryFn: La función que hace la petición a la API.
     * enabled: Solo se ejecuta si el usuario tiene un token de sesión.
     */
    const { data: posts, isLoading, isError } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
        enabled: !!session?.token,
    });

    /**
     * useMutation: Hook para realizar operaciones de escritura (crear un post).
     * onSuccess: Si la petición sale bien, invalidamos la caché de "posts" para que se refresque la lista automáticamente.
     */
    const createPostMutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    // Protección de ruta: Si no hay token, redirigimos al usuario al login.
    if (!session?.token) {
        return <Navigate to="/auth/login" replace />;
    }

    /**
     * handleCreatePost: Función que se dispara cuando el usuario envía el formulario de post.
     * @param {string} content - El texto del nuevo post.
     */
    const handleCreatePost = (content) => {
        createPostMutation.mutate({ content, userId: session.userId });
    };

    return (
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ py: 4 }}>
                {/* Tarjeta con la información del usuario logueado */}
                <UserCard name={session.name} username={session.username} />

                {/* Formulario para escribir una nueva publicación */}
                <UserPostForm 
                    name={session.name} 
                    onSubmit={handleCreatePost} 
                    isLoading={createPostMutation.isPending}
                />

                {/* Indicador de carga mientras se obtienen los posts */}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Alerta en caso de error de conexión con la API */}
                {isError && (
                    <Alert severity="error">Error al cargar las publicaciones.</Alert>
                )}

                {/* Lista de publicaciones: Si hay posts, los recorremos y renderizamos */}
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <Box 
                            key={post.id} 
                            onClick={() => navigate(`/post/${post.id}`)} // Al hacer clic, vamos al detalle del post
                            sx={{ cursor: 'pointer', transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}
                        >
                            <Post post={post} />
                        </Box>
                    ))
                ) : (
                    // Si no hay posts todavía, mostramos un mensaje amigable
                    !isLoading && (
                        <Typography variant="body1" textAlign="center">
                            No hay publicaciones todavía. ¡Sé el primero en compartir algo!
                        </Typography>
                    )
                )}
            </Stack>
        </Container>
    );
}

export default FeedPage;
