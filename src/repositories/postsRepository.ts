import {CommentDBType, CommentType, PostDBType, PostType} from '../types';
import {Post} from '../models/post';
import {Comment} from '../models/comment';
import {CommentRepository} from './commentsRepository';
import {LikeStatus} from '../enums/Likes';
import {LikesRepository} from './likesRepository';
import {CommentLikeDBType, PostLikeDBType} from '../types/likeType';
import {inject, injectable} from 'inversify';

export interface GetCommentProps {
    userId?: string;
    postId: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

@injectable()
export class PostRepository {
    constructor(
        @inject(CommentRepository) protected commentRepository: CommentRepository,
        @inject(LikesRepository) protected likesRepository: LikesRepository) {
    }

    async getPosts(page: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc', userId?: string) {
        const postQuery = Post.find();
        const totalCount = await Post.countDocuments();
        const pagesCount = Math.ceil(totalCount / pageSize);
        const posts = await postQuery
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();


        const postWithLikes = await Promise.all(posts.map(async (post) => {
            let likeInfo: PostLikeDBType | null = null;
            let myStatus = LikeStatus.NONE;
            if (userId) {
                likeInfo = await this.likesRepository.getPostLikeInfo(userId, post._id.toString());
            }
            if (likeInfo) {
                myStatus = likeInfo.likeStatus;
            }
            const newestLikeInfo = await this.likesRepository.getNewestLikesOfPost(post._id.toString());
            return this._mapDbPostToOutputModel({
                ...post,
                extendedLikesInfo: {...post.extendedLikesInfo, newestLikes: newestLikeInfo}
            }, myStatus);
        }));

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: postWithLikes
        };
    }

    async getPostById(id: string, userId?: string) {
        const post = await Post.findById(id).lean();
        let likeInfo: PostLikeDBType | null = null;
        let myStatus = LikeStatus.NONE;
        if (userId) {
            likeInfo = await this.likesRepository.getPostLikeInfo(userId, id);
        }
        if (likeInfo) {
            myStatus = likeInfo.likeStatus;
        }
        const newestLikeInfo = await this.likesRepository.getNewestLikesOfPost(id);
        return post ? this._mapDbPostToOutputModel({
            ...post,
            extendedLikesInfo: {...post.extendedLikesInfo, newestLikes: newestLikeInfo}
        }, myStatus) : null;
    }

    async createPost(post: Omit<PostType, 'id'>) {
        let newPost = new Post(post);
        newPost = await newPost.save();
        return this._mapDbPostToOutputModel(newPost);
    }

    async getCommentsByPostId({
                                  userId,
                                  postId,
                                  sortBy = 'createdAt',
                                  sortDirection = 'desc',
                                  page = 1,
                                  pageSize = 10
                              }: GetCommentProps) {
        const commentQuery = Comment.find({postId});
        const totalCount = await Comment.countDocuments({postId});
        const pagesCount = Math.ceil(totalCount / pageSize);
        const comments = await commentQuery
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();


        const commentsWithLikes = await Promise.all(comments.map(async (comment) => {
            let likeInfo: CommentLikeDBType | null = null;
            let myStatus = LikeStatus.NONE;
            if (userId) {
                likeInfo = await this.likesRepository.getCommentLikeInfo(userId, comment._id.toString());
            }
            if (likeInfo) {
                myStatus = likeInfo.likeStatus;
            }
            return this.commentRepository._mapDbCommentToOutputModel(comment, myStatus);
        }));

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: commentsWithLikes
        };
    }

    async addComment(comment: CommentDBType): Promise<CommentType> {
        let newComment = new Comment(comment);
        newComment = await newComment.save();
        return {...this.commentRepository._mapDbCommentToOutputModel(newComment, LikeStatus.NONE)};
    }

    async updatePost(id: string, updatedPost: Omit<PostType, 'blogName'>) {
        const result = await Post.findByIdAndUpdate(id, updatedPost);
        return result;
    }

    async updatePostLikeInfo(id: string, extendedLikesInfo: { likesCount: number, dislikesCount: number }) {
        const result = await Post.findByIdAndUpdate(id, {extendedLikesInfo});
        return result;
    }

    async deletePost(id: string) {
        const result = await Post.findByIdAndDelete(id);
        return result;
    }

    async clearAllPosts() {
        await Post.deleteMany({});
    }

    _mapDbPostToOutputModel(post: PostDBType, myStatus?: LikeStatus): PostType {
        return {
            id: post._id.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            blogId: post.blogId,
            content: post.content,
            title: post.title,
            shortDescription: post.shortDescription,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: myStatus ?? (post.extendedLikesInfo?.myStatus || LikeStatus.NONE),
                newestLikes: post.extendedLikesInfo?.newestLikes ?? [],
            },
        };
    }
}
