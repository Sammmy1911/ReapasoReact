import {
    Container,
    Stack,
    CircularProgress,
    Alert,
    Box,
    Typography,
    TextField,
    Button,
    Paper
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Navigate, useNavigate } from "react-router";
import { useState } from "react";

import Post from "../../components/Post";
import Comments from "../../components/Comments";
import { getPosts, getCommentsByPostId, addComment } from "../feed/services/FeedServices";

function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [commentContent, setCommentContent] = useState("");
    
    const session = JSON.parse(localStorage.getItem("postManagerSession") || "null");

    // Fetch all posts and find the specific one (simulating findById since the service uses getAll)
    // Ideally there should be a getPostById in services
    const { data: posts, isLoading: isLoadingPost, isError: isErrorPost } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
        enabled: !!session?.token,
    });

    const post = posts?.find(p => p.id === parseInt(id));

    const { data: comments, isLoading: isLoadingComments, isError: isErrorComments } = useQuery({
        queryKey: ["comments", id],
        queryFn: () => getCommentsByPostId(id),
        enabled: !!session?.token && !!id,
    });

    const addCommentMutation = useMutation({
        mutationFn: (content) => addComment(id, { content, userId: session.userId }),
        onSuccess: () => {
            setCommentContent("");
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    if (!session?.token) {
        return <Navigate to="/auth/login" replace />;
    }

    const handleBack = () => {
        navigate("/feed");
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentContent.trim()) {
            addCommentMutation.mutate(commentContent);
        }
    };

    if (isLoadingPost || isLoadingComments) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (isErrorPost || !post) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>Publicación no encontrada.</Alert>
                <Button onClick={handleBack} sx={{ mt: 2 }}>Volver al Feed</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ py: 4 }}>
                <Button onClick={handleBack} sx={{ alignSelf: 'flex-start' }}>
                    &larr; Volver al Feed
                </Button>

                <Post post={post} />

                <Typography variant="h6">Comentarios</Typography>

                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <form onSubmit={handleCommentSubmit}>
                        <TextField
                            fullWidth
                            placeholder="Escribe un comentario..."
                            multiline
                            rows={2}
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                disabled={addCommentMutation.isPending || !commentContent.trim()}
                            >
                                {addCommentMutation.isPending ? "Enviando..." : "Comentar"}
                            </Button>
                        </Box>
                    </form>
                </Paper>

                {isErrorComments ? (
                    <Alert severity="error">Error al cargar los comentarios.</Alert>
                ) : (
                    <Comments comments={comments} />
                )}
            </Stack>
        </Container>
    );
}

export default PostPage;
