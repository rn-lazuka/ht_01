import request from 'supertest';
import express from 'express';
import {authRouter} from '../src/routes/auth-router';
import {userService} from '../src/domain/userService';
import {userRepository} from '../src/repositories/userRepository';
import {ObjectId} from 'mongodb';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

jest.mock('../src/domain/userService');
jest.mock('../src/repositories/userRepository');

const mockCreateUser = userService.createUser as jest.MockedFunction<typeof userService.createUser>;
const mockFindUserByLoginOrEmail = userRepository.findUserByLoginOrEmail as jest.MockedFunction<typeof userRepository.findUserByLoginOrEmail>;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('POST /auth/registration', () => {
    it('should return 204 if the registration is successful', async () => {
        mockCreateUser.mockResolvedValue({
            login: 'testlogin',
            email: 'test@example.com',
            _id: new ObjectId(),
            createdAt: new Date().toISOString()
        });
        mockFindUserByLoginOrEmail.mockResolvedValue(null);
        const response = await request(app)
            .post('/auth/registration')
            .send({
                email: 'test@example.com',
                login: 'testlogin',
                password: 'testpassword'
            });
        expect(response.status).toBe(204);
    });

    it('should return 400 if the registration is unsuccessful', async () => {
        mockCreateUser.mockResolvedValue(null);
        mockFindUserByLoginOrEmail.mockResolvedValue(null);
        const response = await request(app)
            .post('/auth/registration')
            .send({
                email: 'test@example.com',
                login: 'testlogin',
                password: 'testpassword'
            });
        expect(response.status).toBe(400);
    });

    it('should return 400 if the login already exists', async () => {
        mockFindUserByLoginOrEmail.mockResolvedValueOnce({
            login: 'testlogin',
            email: 'test@example.com',
            id: '1',
            createdAt: new Date().toISOString()
        });
        const response = await request(app)
            .post('/auth/registration')
            .send({
                email: 'test@example.com',
                login: 'testlogin',
                password: 'testpassword'
            });
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages[0].message).toBe('Login already exist');
    });

    it('should return 400 if the email already exists', async () => {
        mockFindUserByLoginOrEmail.mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
                login: 'testlogin',
                email: 'test@example.com',
                id: '1',
                createdAt: new Date().toISOString()
            });
        const response = await request(app)
            .post('/auth/registration')
            .send({
                email: 'test@example.com',
                login: 'testlogin',
                password: 'testpassword'
            });
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages[0].message).toBe('Email already exist');
    });
});
