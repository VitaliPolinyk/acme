import { Container } from 'inversify';

export let container = new Container({ autoBindInjectable: true });

export const TYPES = {
    'Logger': Symbol.for('Logger'),
    'Controller': Symbol.for('Controller'),
    'ConnectionProvider': Symbol.for('ConnectionProvider'),
    'DefaultConnection': Symbol.for('DefaultConnection'),
    'AuthService': Symbol.for('AuthService'),
    'UserRepository': Symbol.for('UserRepository'),
    'EventRepository': Symbol.for('EventRepository'),
    'CommentRepository': Symbol.for('CommentRepository')
};