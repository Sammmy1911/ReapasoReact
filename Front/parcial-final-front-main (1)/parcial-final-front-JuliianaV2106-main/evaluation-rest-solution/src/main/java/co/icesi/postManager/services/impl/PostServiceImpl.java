package co.icesi.postManager.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.icesi.postManager.model.Comments;
import co.icesi.postManager.model.Post;
import co.icesi.postManager.repositories.CommentsRepository;
import co.icesi.postManager.repositories.PostRepository;
import co.icesi.postManager.services.interfaces.PostService;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentsRepository commentsRepository;

    @Override
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public void deletePost(long postId) {
        postRepository.deleteById(postId);
    }

    @Override
    public Post getPostById(long postId) {
        return postRepository.findById(postId).orElse(null);
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Comments addCommentToPost(Post post, Comments comment) {
        comment.setPost(post);
        return commentsRepository.save(comment);
    }
}
