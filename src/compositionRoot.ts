import 'reflect-metadata';
import {UserRepository} from './repositories/userRepository';
import {UserService} from './domain/userService';
import {UserController} from './controllers/userController';
import {BlogService} from './domain/blogService';
import {BlogController} from './controllers/blogController';
import {PostRepository} from './repositories/postsRepository';
import {PostService} from './domain/postsService';
import {PostController} from './controllers/postController';
import {CommentRepository} from './repositories/commentsRepository';
import {CommentService} from './domain/commentsService';
import {CommentController} from './controllers/commentController';
import {DeviceRepository} from './repositories/devicesRepository';
import {DeviceService} from './domain/deviceService';
import {DeviceController} from './controllers/deviceController';
import {JwtService} from './domain/jwtService';
import {AuthService} from './domain/authService';
import {AuthController} from './controllers/authController';
import {ApiRequestInfoRepository} from './repositories/apiRequestInfoRepository';
import {ApiRequestInfoService} from './domain/apiRequestInfoService';
import {EmailAdapter} from './adapters/emailAdapter';
import {MailService} from './domain/mailService';
import {LikeService} from './domain/likeService';
import {TestingRepository} from './repositories/testingRepository';
import {Container} from 'inversify';
import { BlogRepository } from './repositories/blogRepository';
import { LikesRepository } from './repositories/likesRepository';
import { AuthRepository } from './repositories/authRepository';

export const container = new Container()

container.bind(TestingRepository).to(TestingRepository)

container.bind(EmailAdapter).to(EmailAdapter)

container.bind(ApiRequestInfoRepository).to(ApiRequestInfoRepository)
container.bind(LikesRepository).to(LikesRepository)
container.bind(AuthRepository).to(AuthRepository)

container.bind(ApiRequestInfoService).to(ApiRequestInfoService)
container.bind(JwtService).to(JwtService)
container.bind(LikeService).to(LikeService)
container.bind(MailService).to(MailService)

container.bind(UserController).to(UserController)
container.bind(UserService).to(UserService)
container.bind(UserRepository).to(UserRepository)

container.bind(BlogController).to(BlogController)
container.bind(BlogService).to(BlogService)
container.bind(BlogRepository).to(BlogRepository)

container.bind(PostController).to(PostController)
container.bind(PostService).to(PostService)
container.bind(PostRepository).to(PostRepository)

container.bind(CommentController).to(CommentController)
container.bind(CommentService).to(CommentService)
container.bind(CommentRepository).to(CommentRepository)

container.bind(DeviceController).to(DeviceController)
container.bind(DeviceService).to(DeviceService)
container.bind(DeviceRepository).to(DeviceRepository)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)
