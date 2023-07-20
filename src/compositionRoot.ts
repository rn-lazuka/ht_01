import {UserRepository} from './repositories/userRepository';
import {UserService} from './domain/userService';
import {UserController} from './controllers/userController';
import {BlogRepository} from './repositories/blogRepository';
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
import {AuthRepository} from './repositories/authRepository';
import {JwtService} from './domain/jwtService';
import {AuthService} from './domain/authService';
import {AuthController} from './controllers/authController';
import {ApiRequestInfoRepository} from './repositories/apiRequestInfoRepository';
import {ApiRequestInfoService} from './domain/apiRequestInfoService';
import {EmailAdapter} from './adapters/emailAdapter';
import {MailService} from './domain/mailService';

const emailAdapter = new EmailAdapter();

export const userRepository = new UserRepository();
export const blogRepository = new BlogRepository();
export const postRepository = new PostRepository();
export const commentRepository = new CommentRepository();
export const deviceRepository = new DeviceRepository();
export const authRepository = new AuthRepository();
export const apiRequestInfoRepository = new ApiRequestInfoRepository();

export const mailService = new MailService(emailAdapter);
export const userService = new UserService(userRepository, mailService);
export const blogService = new BlogService(blogRepository);
const postService = new PostService(postRepository, blogRepository);
const commentService = new CommentService(commentRepository);
export const jwtService = new JwtService(authRepository, userRepository);
const deviceService = new DeviceService(deviceRepository,jwtService);
export const apiRequestInfoService = new ApiRequestInfoService(apiRequestInfoRepository);
const authService = new AuthService(userService, jwtService, userRepository); //TODO нормально ли использовать сервисы в других сервисах


export const userController = new UserController(userService);
export const blogController = new BlogController(blogService, postService);
export const postController = new PostController(postService);
export const commentController = new CommentController(commentService);
export const deviceController = new DeviceController(deviceService,jwtService);
export const authController = new AuthController(authService, jwtService, deviceService, userService);

