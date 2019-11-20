// @ts-nocheck
import 'reflect-metadata';
import * as request from 'supertest';
import { Http } from './Http';
import { container, TYPES } from '../../config/container';
import { ILogger } from '../../domain/ILogger';
import { Logger } from '../Logger';
import { App } from '../App';
import { RequestState } from './RequestState';
import { RequestMiddleware } from './middlewares/RequestMiddleware';
import { IEventRepository } from '../../domain/event/IEventRepository';
import { ICommentRepository } from '../../domain/comment/ICommentRepository';
import { IUserRepository } from '../../domain/user/IUserRepository';
import { AuthService } from '../../domain/user/AuthService';
import { SeedDatabase } from '../database/SeedDatabase';
import { UserInmemoryRepository } from '../database/UserInmemoryRepository';
import { EventInmemoryRepository } from '../database/EventInmemoryRepository';
import { CommentInmemoryRepository } from '../database/CommentInmemoryRepository';

// configure DI
container.bind<Http>(Http).toSelf().inSingletonScope();
container.bind<ILogger>(TYPES.Logger).to(Logger).inRequestScope();

container.bind<App>(App).toSelf().inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserInmemoryRepository).inSingletonScope();
container.bind<IEventRepository>(TYPES.EventRepository).to(EventInmemoryRepository).inSingletonScope();
container.bind<ICommentRepository>(TYPES.CommentRepository).to(CommentInmemoryRepository).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inRequestScope();
container.bind<RequestState>(RequestState).toSelf().inRequestScope();
container.bind<RequestMiddleware>(RequestMiddleware).toSelf().inRequestScope();
container.bind<SeedDatabase>(SeedDatabase).toSelf().inSingletonScope();

let user: any = {
    email: 'user@backend.local',
    password: 'user'
};

let user2: any = {
    email: 'test@backend.local',
    password: 'test'
};

let event: any = {
    title: 'Dog Charity (Test)',
    datetime: '2019-11-19T08:29:55.000Z'
};

let comment: any = {
    text: 'Lorem ipsum'
};

let app;
let http;
let logger;

async function startApp() {
    logger = container.get<ILogger>(TYPES.Logger);
    logger.setPrefix('tests');

    app = container.get<App>(App);
    http = container.get<Http>(Http);

    try {
        await http.start();
        await app.start();

        const seed = container.get<SeedDatabase>(SeedDatabase);
        await seed.execute();

        logger.info(`everything is ready`);
    } catch (err) {
        logger.error('catch error: ', err.stack);
    }
}

beforeAll(async () => {
    await startApp();
});

describe('AppController', () => {
    test('GET /healthz', async () => {
        const response = await request(http.server).get('/healthz');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual(JSON.stringify({ status: 'ok' }));
    });

    test('GET /apidoc/developer', async () => {
        const response = await request(http.server).get('/apidoc/developer');
        expect(response.status).toEqual(200);
    });
});

describe('UserController', () => {
    test('POST /api/v1/login - correct credentials', async () => {
        const response = await request(http.server)
            .post('/api/v1/login')
            .set('Accept', 'application/json')
            .send(user);

        const body = JSON.parse(response.text);
        expect(body).toMatchObject({ email: user.email });
        expect(body.token).toBeDefined();
        expect(response.status).toEqual(200);

        user = { ...body };
    });

    test('POST /api/v1/login - reject incorrect credentials', async () => {
        const response = await request(http.server)
            .post('/api/v1/login')
            .set('Accept', 'application/json')
            .send(user2);

        expect(response.status).toEqual(400);
    });

    test('GET /api/v1/user/:userId', async () => {
        const response = await request(http.server)
            .get(`/api/v1/user/${user.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(200);
    });

    test('GET /api/v1/user/:userId - reject access to another user', async () => {
        const response = await request(http.server)
            .get(`/api/v1/user/2`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);
    });

});

describe('EventController', () => {

    test('POST /api/v1/event - reject non auth', async () => {
        const response = await request(http.server)
            .post('/api/v1/event')
            .set('Accept', 'application/json')
            .send(event);

        expect(response.status).toEqual(401);
    });

    test('POST /api/v1/event', async () => {
        event.userId = user.id;

        const response = await request(http.server)
            .post('/api/v1/event')
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json')
            .send(event);

        expect(response.status).toEqual(201);
        const body = JSON.parse(response.text);
        expect(body).toMatchObject({ userId: user.id, title: event.title });
        event = { ...body };
    });

    test('PUT /api/v1/event/:eventId - reject non auth', async () => {
        const update = { title: 'Dog Charity (Test Updated)' };
        const response = await request(http.server)
            .put(`/api/v1/event/${event.id}`)
            .set('Accept', 'application/json')
            .send(update);

        expect(response.status).toEqual(401);
    });

    test('PUT /api/v1/event/:eventId', async () => {
        const update = { title: 'Dog Charity (Test Updated)' };
        const response = await request(http.server)
            .put(`/api/v1/event/${event.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json')
            .send(update);

        expect(response.status).toEqual(200);
        const body = JSON.parse(response.text);
        expect(body).toMatchObject({ ...update, id: event.id });
        event = { ...body };
    });

    test('GET /api/v1/event', async () => {
        const response = await request(http.server)
            .get(`/api/v1/event`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(200);
        const body = JSON.parse(response.text);
        expect(body.length).toEqual(6);
    });

    test('DELETE /api/v1/event/:eventId - reject non auth', async () => {
        const response = await request(http.server)
            .delete(`/api/v1/event/${event.id}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);
    });

    test('DELETE /api/v1/event/:eventId', async () => {
        const response = await request(http.server)
            .delete(`/api/v1/event/${event.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(200);

        const eventToDeleteResponse = await request(http.server)
            .get(`/api/v1/event/${event.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(eventToDeleteResponse.status).toEqual(404);
    });

});

describe('CommentController', () => {

    // create an even
    test('POST /api/v1/event', async () => {
        event.userId = user.id;

        const response = await request(http.server)
            .post('/api/v1/event')
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json')
            .send(event);

        expect(response.status).toEqual(201);
        const body = JSON.parse(response.text);
        expect(body).toMatchObject({ userId: user.id, title: event.title });
        event = { ...body };
    });

    test('POST /api/v1/event/:eventId/comment - reject non auth', async () => {
        const response = await request(http.server)
            .post(`/api/v1/event/${event.id}/comment`)
            .set('Accept', 'application/json')
            .send(event);

        expect(response.status).toEqual(401);
    });

    test('POST /api/v1/event/:eventId/comment', async () => {
        const response = await request(http.server)
            .post(`/api/v1/event/${event.id}/comment`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json')
            .send(comment);

        expect(response.status).toEqual(201);
        const body = JSON.parse(response.text);
        expect(body).toMatchObject({ userId: user.id, eventId: event.id, text: comment.text });
        comment = { ...body };
    });

    test('PUT /api/v1/event/:eventId/comment/:commentId - reject non auth', async () => {
        const update = { text: 'Lorem ipsum (Updated)' };

        const response = await request(http.server)
            .put(`/api/v1/event/${event.id}/comment/${comment.id}`)
            .set('Accept', 'application/json')
            .send(update);

        expect(response.status).toEqual(401);
    });

    test('PUT /api/v1/event/:eventId/comment/:commentId - reject non auth', async () => {
        const update = { text: 'Lorem ipsum (Updated)' };

        const response = await request(http.server)
            .put(`/api/v1/event/${event.id}/comment/${comment.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json')
            .send(update);

        expect(response.status).toEqual(200);
        const body = JSON.parse(response.text);
        expect(body).toMatchObject({ ...update, id: comment.id });
    });

    test('GET /api/v1/event/:eventId/comment - reject non auth', async () => {
        const response = await request(http.server)
            .get(`/api/v1/event/${event.id}/comment`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);
    });

    test('GET /api/v1/event/:eventId/comment', async () => {
        const response = await request(http.server)
            .get(`/api/v1/event/${event.id}/comment`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(200);
        const body = JSON.parse(response.text);
        expect(body.length).toEqual(1);
    });

    test('DELETE /api/v1/event/:eventId/comment/:commentId - reject non auth', async () => {
        const response = await request(http.server)
            .delete(`/api/v1/event/${event.id}/comment/${comment.id}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(401);
    });

    test('DELETE /api/v1/event/:eventId/comment/:commentId', async () => {
        const response = await request(http.server)
            .delete(`/api/v1/event/${event.id}/comment/${comment.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(response.status).toEqual(200);

        const commentToDeleteResponse = await request(http.server)
            .get(`/api/v1/event/comment/${comment.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .set('Accept', 'application/json');

        expect(commentToDeleteResponse.status).toEqual(404);
    });

});