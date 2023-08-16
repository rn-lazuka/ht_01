import {CommentLike, PostLike} from '../models/likes';
import {CommentLikeDBType, NewLike, PostLikeDBType} from '../types/likeType';
import {LikeStatus} from '../enums/Likes';
import {injectable} from 'inversify';

@injectable()
export class LikesRepository {
    async getCommentLikeInfo(userId: string, commentId: string): Promise<CommentLikeDBType | null> {
        const result = await CommentLike.findOne({commentId, userId});
        return result;
    }

    async addCommentLikeInfo(commentLikeInfo: CommentLikeDBType) {
        let newCommentLike = new CommentLike(commentLikeInfo);
        newCommentLike = await newCommentLike.save();
        return newCommentLike;
    }

    async updateCommentLikeInfo(userId: string, commentId: string, likeStatus: LikeStatus) {
        const result = await CommentLike.updateOne({userId, commentId}, {likeStatus});
        return result.modifiedCount === 1;
    }

    async getPostLikeInfo(userId: string, postId: string): Promise<PostLikeDBType | null> {
        const result = await PostLike.findOne({postId, userId});
        return result;
    }

    async addPostLikeInfo(likeInfo: PostLikeDBType) {
        let newPostLike = new PostLike(likeInfo);
        newPostLike = await newPostLike.save();
        return newPostLike;
    }

    async updatePostLikeInfo(userId: string, postId: string, likeStatus: LikeStatus,addedAt: string, login: string) {
        const result = await PostLike.updateOne({userId, postId}, {addedAt,login,likeStatus});
        return result.modifiedCount === 1;
    }

    async getNewestLikesOfPost(postId: string) {
        const postsLikeInfo = await PostLike
            .find({postId, likeStatus: 'Like'})
            .sort({addedAt: -1})
            .limit(3)
            .lean();
        return postsLikeInfo.map(postsLikeInfo => this._mapPostsToLatestLikesInfo(postsLikeInfo));
    }

    _mapPostsToLatestLikesInfo(post: PostLikeDBType): NewLike {
        return {
            addedAt: post.addedAt,
            userId: post.userId,
            login: post.login,
        };
    }
}

