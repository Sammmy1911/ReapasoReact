import { Container, Stack } from "@mui/material";

import UserCard from "../components/UserCard";
import UserPostForm from "../components/UserPostForm";
import Post from "../components/Post";

function FeedPage() {
    return (
        <Container maxWidth="md">
            <Stack spacing={3} sx={{ py: 4 }}>
                <UserCard />

                <UserPostForm />

                <Post />
            </Stack>
        </Container>
    );
}

export default FeedPage;