import {CommentEntity, PostType} from '../types';
import {Post} from '../models/post';
import {Comment} from '../models/comment';

export interface GetCommentProps {
    postId: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export const postsRepository = {
    async getPosts(page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const postQuery = Post.find();
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
            items: posts
        };
    },
    async getPostById(id: string) {
        const result = await Post.findByIdAndUpdate(id);
        return result;
    },
    async createPost(post: Omit<PostType, 'id'>) {
        let newPost = new Post(post);
        newPost = await newPost.save();
        return newPost;
    },
    async getCommentsByPostId({
                                  postId,
                                  sortBy = 'createdAt',
                                  sortDirection = 'desc',
                                  page = 1,
                                  pageSize = 10
                              }: GetCommentProps) {
        const commentQuery = Comment.find({postId});
        const totalCount = await commentQuery.countDocuments();
        const pagesCount = Math.ceil(totalCount / pageSize);
        const comments = await commentQuery
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select('-postId')
            .lean();

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: comments,
        };
    },
    async addComment(comment: CommentEntity) {
        let newComment = new Comment(comment);
        newComment = await newComment.save()
        return newComment
    },
    async updatePost(id: string, updatedPost: Omit<PostType, 'blogName'>) {
        const result = await Post.findByIdAndUpdate(id, updatedPost);
        return result;
    },
    async deletePost(id: string) {
        const result = await Post.findByIdAndDelete(id);
        return result;
    },
    async clearAllPosts() {
        await Post.deleteMany({});
    },
    _mapDbPostToOutputModel(post: any): PostType {
        return {
            id: post._id.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            blogId: post.blogId,
            content: post.content,
            title: post.title,
            shortDescription: post.shortDescription,
        };
    }
};
