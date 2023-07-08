import {BlobDBType, BlogType} from '../types';
import {Blog} from '../models/blog';
import {Post} from '../models/post';
import {postsRepository} from './postsRepository';

export const blogRepository = {
    async getBlogs(page: number, pageSize: number, searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc') {
        const blogQuery = Blog.find();
        const filter: any = {};
        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}; // Case-insensitive search
        }
        if (Object.keys(filter).length > 0) {
            blogQuery.where(filter);
        }

        const totalCount = await blogQuery.countDocuments();
        const pagesCount = Math.ceil(totalCount / pageSize);

        const blogs = await blogQuery
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: blogs.map(blog=>this._mapDbBlogToOutputModel(blog))
        };
    },
    async getBlogById(id: string) {
        const result = await Blog.findById(id);
        return result;
    },
    async getAllPostsForBlog(id: string, page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
            const postQuery = Post.find({blogId: id})

            const totalCount = await postQuery.countDocuments();
            const pagesCount = Math.ceil(totalCount / pageSize);

            const posts = await postQuery
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean();

            return {
                pagesCount,
                page,
                pageSize,
                totalCount,
                items: posts.map(post=>postsRepository._mapDbPostToOutputModel(post))
            }
    },
    async createBlog(blog: Omit<BlogType, 'id'>) {
        let newBlog = new Blog(blog);
        newBlog = await newBlog.save();
        return newBlog;
    },
    async updateBlog(id: string, updatedBlog: BlogType) {
        const result = await Blog.findByIdAndUpdate(id, updatedBlog);
        return result;
    },
    async deleteBlog(id: string) {
            const result = await Blog.findByIdAndDelete(id);
            return result
    },
    async clearAllBlogs() {
        const result = await Blog.deleteMany({});
        return result
    },
    _mapDbBlogToOutputModel(blog: BlobDBType): BlogType {
        return {
            id: blog._id.toString(),
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
    }
};
