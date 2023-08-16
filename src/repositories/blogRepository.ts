import {BlogDBType, BlogType} from '../types';
import {Blog} from '../models/blog';
import {Post} from '../models/post';
import {inject, injectable} from 'inversify';
import {PostLikeDBType} from '../types/likeType';
import {LikeStatus} from '../enums/Likes';
import {LikesRepository} from './likesRepository';
import {PostRepository} from './postsRepository';

@injectable()
export class BlogRepository {
    constructor(
        @inject(LikesRepository) protected likesRepository: LikesRepository,
        @inject(PostRepository) protected postRepository: PostRepository) {
    }

    async getBlogs(page: number, pageSize: number, searchNameTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc') {
        const filter: any = {};
        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}; // Case-insensitive search
        }
        const blogQuery = Blog.find(filter);
        const totalCount = await Blog.countDocuments(filter);
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
            items: blogs.map(blog => this._mapDbBlogToOutputModel(blog))
        };
    }

    async getBlogById(id: string) {
        const result = await Blog.findById(id);
        return result;
    }

    async getAllPostsForBlog(id: string, page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc', userId?: string) {
        const postQuery = Post.find({blogId: id});
        const totalCount = await Post.countDocuments({blogId: id});
        const pagesCount = Math.ceil(totalCount / pageSize);

        const posts = await postQuery
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const postsWithLikes = await Promise.all(posts.map(async (post) => {
            let likeInfo: PostLikeDBType | null = null;
            let myStatus = LikeStatus.NONE;
            if (userId) {
                likeInfo = await this.likesRepository.getPostLikeInfo(userId, post._id.toString());
            }
            if (likeInfo) {
                myStatus = likeInfo.likeStatus;
            }
            const newestLikeInfo = await this.likesRepository.getNewestLikesOfPost(post._id.toString());
            return this.postRepository._mapDbPostToOutputModel({
                ...post,
                extendedLikesInfo: {...post.extendedLikesInfo, newestLikes: newestLikeInfo}
            }, myStatus);
        }));

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: postsWithLikes
        };
    }

    async createBlog(blog: BlogDBType) {
        let newBlog = new Blog(blog);
        newBlog = await newBlog.save();
        return newBlog;
    }

    async updateBlog(id: string, updatedBlog: BlogType) {
        const result = await Blog.findByIdAndUpdate(id, updatedBlog);
        return result;
    }

    async deleteBlog(id: string) {
        const result = await Blog.findByIdAndDelete(id);
        return result;
    }

    async clearAllBlogs() {
        const result = await Blog.deleteMany({});
        return result;
    }

    _mapDbBlogToOutputModel(blog: BlogDBType): BlogType {
        return {
            id: blog._id.toString(),
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
    }
}
