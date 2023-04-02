import {app} from '../src/settings';
import {Video} from '../src/types';
import {CodeResponses, VideoResolutions} from '../src/enums';
import request from 'supertest';

describe('/videos', () => {
    let video: any;
    let newVideo: Video = {
        id: 123,
        title: 'new video',
        author: 'Roman',
        availableResolutions: [VideoResolutions.P144]
    };

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204);
    });

    it('GET products = []', async () => {
        await request(app).get('/videos/').expect([]);
    });

    it('- POST does not create the video with incorrect data (no title, no author)', async function () {
        await request(app)
            .post('/videos/')
            .send({title: '', author: ''})
            .expect(CodeResponses.Incorrect_values_400, {
                errorsMessages: [
                    {message: 'required field', field: 'title'},
                    {message: 'required field', field: 'author'},
                ],
            });

        const res = await request(app).get('/videos/');
        expect(res.body).toEqual([]);
    });

    it('- GET product by ID with incorrect id', async () => {
        await request(app).get('/videos/helloWorld').expect(404);
    });
    it('+ GET product by ID with correct id', async () => {
        await request(app).post('/videos').send(newVideo)
        const videos = await request(app).get('/videos')
        video = videos.body.find((video:Video) => video.id === newVideo.id)
        await request(app)
            .get('/videos/' + newVideo!.id)
            .expect(200, video);
    });

    it('- PUT product by ID with incorrect data', async () => {
        await request(app)
            .put('/videos/' + 1223)
            .send({title: 'title', author: 'title'})
            .expect(CodeResponses.Not_found_404);

        const res = await request(app).get('/videos/');
        expect(res.body[0]).toEqual(video);
    });

    it('+ PUT product by ID with correct data', async () => {
        await request(app)
            .put('/videos/' + newVideo.id)
            .send({
                title: 'hello title',
                author: 'hello author',
                publicationDate: '2023-01-12T08:12:39.261Z',
            })
            .expect(CodeResponses.Not_content_204);

        const res = await request(app).get('/videos/');
        expect(res.body[0]).toEqual({
            ...video,
            title: 'hello title',
            author: 'hello author',
            publicationDate: '2023-01-12T08:12:39.261Z',
        });
        newVideo = res.body[0];
    });

    it('- DELETE product by incorrect ID', async () => {
        await request(app)
            .delete('/videos/876328')
            .expect(CodeResponses.Not_found_404);

        const res = await request(app).get('/videos/');
        expect(res.body[0]).toEqual(newVideo);
    });
    it('+ DELETE product by correct ID, auth', async () => {
        await request(app)
            .delete('/videos/' + newVideo!.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(CodeResponses.Not_content_204);

        const res = await request(app).get('/videos/');
        expect(res.body.length).toBe(0);
    });
});

