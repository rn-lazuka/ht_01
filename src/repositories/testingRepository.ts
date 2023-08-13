import { Blog } from "../models/blog";
import {Post} from '../models/post';
import {User} from '../models/user';
import {Comment} from '../models/comment';
import { Device } from "../models/device";
import { CommentLike } from "../models/likes";
import {injectable} from 'inversify';

@injectable()
export class TestingRepository {

    async deleteAllData(): Promise<void> {

        return Promise.all([
            Post.deleteMany({}),
            Blog.deleteMany({}),
            User.deleteMany({}),
            Comment.deleteMany({}),
            Device.deleteMany({}),
            CommentLike.deleteMany({})
        ])
            .then(value => {
                console.log('OK');

            }, reason => {
                console.log(reason)
            });
    }
}
