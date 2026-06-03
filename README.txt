Puedes enseñarme a hacer un crud?

Sí. De hecho, usando tu proyecto de Posts es la mejor forma de aprender porque es un CRUD real.

CRUD significa:

Operación	SQL	HTTP	Ejemplo
Create	INSERT	POST	Crear post
Read	SELECT	GET	Ver posts
Update	UPDATE	PUT	Editar post
Delete	DELETE	DELETE	Borrar post
1. Backend (Spring)

Supongamos que tienes la entidad:

public class Post {

    private Long id;
    private String content;

}
CREATE
Endpoint
@PostMapping("/posts")
public Post create(@RequestBody Post post) {
    return postService.create(post);
}
Frontend
export async function createPost(post) {
    const response = await axios.post(
        "/posts",
        post
    );

    return response.data;
}
Uso
createPost({
    content: "Hola mundo"
});
2. READ
Obtener todos

Backend:

@GetMapping("/posts")
public List<Post> getAll() {
    return postService.findAll();
}

Frontend:

export async function getPosts() {
    const response = await axios.get("/posts");

    return response.data;
}

React Query:

const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
});

Mostrar:

{
    postsQuery.data?.map(post => (
        <div key={post.id}>
            {post.content}
        </div>
    ))
}
Obtener uno

Backend:

@GetMapping("/posts/{id}")
public Post getById(
    @PathVariable Long id
) {
    return postService.findById(id);
}

Frontend:

export async function getPostById(id) {
    const response =
        await axios.get(`/posts/${id}`);

    return response.data;
}
3. UPDATE

Backend:

@PutMapping("/posts")
public Post update(
    @RequestBody Post post
) {
    return postService.update(post);
}

Frontend

export async function updatePost(post) {

    const response =
        await axios.put(
            "/posts",
            post
        );

    return response.data;
}

Uso:

updatePost({
    id: 1,
    content: "Texto actualizado"
});

React Query

const updateMutation = useMutation({
    mutationFn: updatePost,
});

Ejecutar:

updateMutation.mutate({
    id: 1,
    content: "Nuevo texto"
});
4. DELETE

Backend:

@DeleteMapping("/posts/{id}")
public void delete(
    @PathVariable Long id
) {
    postService.delete(id);
}

Frontend

export async function deletePost(id) {

    await axios.delete(
        `/posts/${id}`
    );
}

Uso

deletePost(5);
CRUD completo en React
Estado del formulario
const [content, setContent] =
    useState("");
Crear
const createMutation =
    useMutation({
        mutationFn: createPost
    });

createMutation.mutate({
    content
});
Leer
const postsQuery =
    useQuery({
        queryKey: ["posts"],
        queryFn: getPosts
    });
Actualizar
updateMutation.mutate({
    id: post.id,
    content: nuevoTexto
});
Eliminar
deleteMutation.mutate(post.id);
Cómo se ve el flujo completo

Usuario:

Escribe un post

↓

<TextField />

↓

setContent(...)

↓

createMutation.mutate(...)

↓

axios.post("/posts")

↓

@PostMapping("/posts")

↓

Base de datos

↓

Respuesta JSON

↓

React Query actualiza

↓

Feed actualizado

Lo más importante para tu parcial

Apréndete este patrón:

GET
useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
});
POST
useMutation({
    mutationFn: createPost,
});
PUT
useMutation({
    mutationFn: updatePost,
});
DELETE
useMutation({
    mutationFn: deletePost,
});

Porque prácticamente todos los CRUD en React con Axios y React Query siguen exactamente esa estructura.

Puedes hacer un ejemplo de implementacion completa? Podrías mostrar las clases completas?

Sí. Te voy a mostrar un CRUD completo siguiendo exactamente el estilo que estás usando en tu parcial:

React
Axios
React Query
Material UI
Spring Boot como backend

Imaginemos que queremos administrar Posts.

1. API (postManagerApi.js)

Esta capa se encarga de hablar con el backend.

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

export async function getPosts() {
    const { data } = await api.get("/posts");
    return data;
}

export async function getPostById(id) {
    const { data } = await api.get(`/posts/${id}`);
    return data;
}

export async function createPost(post) {
    const { data } = await api.post(
        "/posts",
        post
    );

    return data;
}

export async function updatePost(post) {
    const { data } = await api.put(
        "/posts",
        post
    );

    return data;
}

export async function deletePost(id) {
    await api.delete(`/posts/${id}`);
}
2. FeedPage.jsx (READ)

Obtiene los posts.

import { Container, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "../api/postManagerApi";
import Post from "../components/Post";

function FeedPage() {

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    if (postsQuery.isLoading) {
        return <p>Cargando...</p>;
    }

    return (
        <Container>
            <Stack spacing={2}>
                {
                    postsQuery.data?.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                        />
                    ))
                }
            </Stack>
        </Container>
    );
}

export default FeedPage;
3. UserPostForm.jsx (CREATE)

Crear publicaciones.

import {
    Button,
    Paper,
    TextField
} from "@mui/material";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPost } from "../api/postManagerApi";

function UserPostForm() {

    const [content, setContent] =
        useState("");

    const queryClient =
        useQueryClient();

    const createMutation =
        useMutation({
            mutationFn: createPost,

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["posts"]
                });

                setContent("");
            },
        });

    const handleSubmit = (e) => {
        e.preventDefault();

        createMutation.mutate({
            content,
            userId: 1,
        });
    };

    return (
        <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }
                />

                <Button
                    type="submit"
                    variant="contained"
                >
                    Publicar
                </Button>

            </form>
        </Paper>
    );
}

export default UserPostForm;
4. Post.jsx (READ)

Mostrar un post.

import {
    Paper,
    Typography
} from "@mui/material";

function Post({ post }) {

    return (
        <Paper sx={{ p: 2 }}>

            <Typography variant="h6">
                {post.user.firstName}
            </Typography>

            <Typography>
                {post.content}
            </Typography>

            <Typography
                variant="caption"
            >
                {post.commentsCount}
                comentarios
            </Typography>

        </Paper>
    );
}

export default Post;
5. EditPost.jsx (UPDATE)

Editar un post.

import {
    Button,
    TextField
} from "@mui/material";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { updatePost } from "../api/postManagerApi";

function EditPost({ post }) {

    const [content, setContent] =
        useState(post.content);

    const updateMutation =
        useMutation({
            mutationFn: updatePost,
        });

    const handleUpdate = () => {

        updateMutation.mutate({
            id: post.id,
            content,
            userId: post.user.id,
        });
    };

    return (
        <>
            <TextField
                fullWidth
                value={content}
                onChange={(e) =>
                    setContent(
                        e.target.value
                    )
                }
            />

            <Button
                onClick={handleUpdate}
            >
                Guardar
            </Button>
        </>
    );
}

export default EditPost;
6. DeleteButton.jsx (DELETE)

Eliminar un post.

import { Button } from "@mui/material";

import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import {
    deletePost
} from "../api/postManagerApi";

function DeleteButton({ postId }) {

    const queryClient =
        useQueryClient();

    const deleteMutation =
        useMutation({
            mutationFn: deletePost,

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["posts"]
                });
            },
        });

    return (
        <Button
            color="error"
            onClick={() =>
                deleteMutation.mutate(postId)
            }
        >
            Eliminar
        </Button>
    );
}

export default DeleteButton;
Qué hace cada hook
useState

Guarda datos del formulario.

const [content, setContent] =
    useState("");
useQuery

Hace GET.

useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
});
useMutation

Hace POST, PUT o DELETE.

useMutation({
    mutationFn: createPost,
});
queryClient.invalidateQueries

Le dice a React Query:

"Oye, vuelve a pedir los posts
porque algo cambió"
queryClient.invalidateQueries({
    queryKey: ["posts"]
});

Por ejemplo:

Creo un post
↓
POST /posts
↓
Éxito
↓
invalidateQueries(["posts"])
↓
GET /posts otra vez
↓
Feed actualizado

Este patrón (API → useQuery/useMutation → Componentes) es prácticamente el que usarás para resolver el parcial completo de Posts y Comentarios.
