import mongoose from 'mongoose';
import {MONGO_URI} from '../src/db';
import {app} from '../src/settings';

const request = require('supertest');

let userId1;
let accessToken: string;
let userId2;
let accessToken2: string;
let userId3;
let accessToken3: string;
let commentId1;

describe('comments: /comments - test like status', () => {

    beforeAll(async () => {
        await mongoose.connection.close();
        await mongoose.connect(MONGO_URI);

        await request(app)
            .delete('/testing/all-data')
            .expect(204);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it(`(Addition) + POST -> create new users; status 201
                         + POST -> '/login' should login in system with 'email'; status: 200`, async () => {

        //user1 user2 user3
        const user1 = await request(app)
            .post(`/users`)
            .auth('admin', 'qwerty')
            .send({login: 'qwerty', password: 'admin123', email: 'test@gmail.com'})
            .expect(201);
        const user2 = await request(app)
            .post(`/users`)
            .auth('admin', 'qwerty')
            .send({login: 'qwerty1', password: 'admin123', email: 'test1@gmail.com'})
            .expect(201);
        const user3 = await request(app)
            .post(`/users`)
            .auth('admin', 'qwerty')
            .send({login: 'qwerty2', password: 'admin123', email: 'test2@gmail.com'})
            .expect(201);

        userId1 = user1.body.id;
        userId2 = user2.body.id;
        userId3 = user2.body.id;

        const response = await request(app)
            .post(`/auth/login`)
            .send({loginOrEmail: 'qwerty', password: 'admin123'})
            .expect(200);
        expect(response.body).toEqual({accessToken: expect.any(String)});

        const response2 = await request(app)
            .post(`/auth/login`)
            .send({loginOrEmail: 'qwerty1', password: 'admin123'})
            .expect(200);
        expect(response2.body).toEqual({accessToken: expect.any(String)});

        const response3 = await request(app)
            .post(`/auth/login`)
            .send({loginOrEmail: 'qwerty2', password: 'admin123'})
            .expect(200);
        expect(response3.body).toEqual({accessToken: expect.any(String)});

        accessToken = response.body.accessToken;
        accessToken2 = response2.body.accessToken;
        accessToken3 = response3.body.accessToken;
    });

    it(`(Addition)
              + POST -> "/blogs": should create new blog; status 201;
              + POST -> "/posts": should create new post; status 201;
              + POST -> '/posts/{id}/comments' should create new comment; status: 201;
              + GET  -> '/posts/{id}/comments' should return comment, status 200`, async () => {

        const responseBlog = await request(app)
            .post(`/blogs`)
            .auth('admin', 'qwerty')
            .send({
                name: 'Blog2-ITforYOU',
                description: 'some information',
                websiteUrl: 'https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF'
            }).expect(201);

        const responsePost = await request(app)
            .post(`/posts`)
            .auth('admin', 'qwerty')
            .send({
                title: 'post 1',
                shortDescription: 'something interesting',
                content: 'content of the post',
                blogId: responseBlog.body.id
            }).expect(201);

        const responseComment = await request(app)
            .post(`/posts/${responsePost.body.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'super normal content 12341235123412351235'})
            .expect(201);

        commentId1 = responseComment.body.id;

        const comment = await request(app)
            .get(`/comments/${commentId1}`)
            .expect(200);
        expect(comment.body.likesInfo).toEqual({
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None'
        });

        const responseLikeCommentByUser1 = await request(app)
            .put(`/comments/${commentId1}/like-status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({likeStatus: 'Like'})
            .expect(204);

        const responseLikeCommentByUser2 = await request(app)
            .put(`/comments/${commentId1}/like-status`)
            .set('Authorization', `Bearer ${accessToken2}`)
            .send({likeStatus: 'Like'})
            .expect(204);

        const responseLikeCommentByUser3 = await request(app)
            .put(`/comments/${commentId1}/like-status`)
            .set('Authorization', `Bearer ${accessToken3}`)
            .send({likeStatus: 'Like'})
            .expect(204);

        const commentUpdated = await request(app)
            .get(`/comments/${commentId1}`)
            .expect(200);
        expect(comment.body.likesInfo).toEqual({
            likesCount: 3,
            dislikesCount: 0,
            myStatus: 'None'
        });
    });
});
