import {Post} from '../types';
import {blogRepository} from './blogRepository';

let posts: Post[] = [];

export const postsRepository = {
    getPosts() {
        return posts;
    },
    getPostById(id: string) {
        return posts.find(blog => blog.id === id);
    },
    createPost(post: Omit<Post, 'id'>) {
        const newPost = {
            ...post,
            blogName: blogRepository.getBlogById(post.blogId)!.name,
            id: new Date().getTime().toString()
        };
        posts.push(newPost);
        return newPost;
    },
    updatePost(id: string, updatedPost: Omit<Post, 'blogName'>) {
        const index = posts.findIndex(post => post.id === id);
        if (index === -1) {
            return false;
        }
        posts[index] = {blogName: posts[index].blogName, ...updatedPost, id};
        return true;
    },
    deletePost(id: string) {
        const index = posts.findIndex(post => post.id === id);
        if (index !== -1) {
            posts.splice(index, 1);
            return true;
        } else {
            return false;
        }
    },
    clearAllPosts() {
        posts = [];
    }
};
