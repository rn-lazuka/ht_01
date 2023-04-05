import {Blog} from '../types';

let blogs: Blog[] = [];

export const blogRepository = {
    getBlogs() {
        return blogs;
    },
    getBlogById(id: string) {
        return blogs.find(blog => blog.id === id);
    },
    createBlog(blog: Omit<Blog, 'id'>) {
        const newBlog = {...blog, id: new Date().getTime().toString()};
        blogs.push(newBlog);
        return newBlog
    },
    updateBlog(id: string, updatedBlog: Blog) {
        const index = blogs.findIndex(blog => blog.id === id);
        if (index === -1) {
            return false;
        }
        blogs[index] = {...updatedBlog, id};
        return true;
    },
    deleteBlog(id: string) {
        const index = blogs.findIndex(blog => blog.id === id);
        if (index !== -1) {
            blogs.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }
};
