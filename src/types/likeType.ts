import { LikeStatus } from "../enums/Likes";

export class CommentLikeDBType {
    constructor(
        public commentId: string,
        public userId: string,
        public likeStatus: LikeStatus
    ) {
    }
}
