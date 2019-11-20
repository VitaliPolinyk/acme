import * as jwt from 'jsonwebtoken';
import bcrypt = require('bcryptjs');
import { injectable } from 'inversify';
import config from '../../config';

export interface ITokenUser {
    id: number;
}

@injectable()
export class AuthService {
    private ALGORITHM = 'HS256';

    constructor() { }

    /**
     * Compare a password provided from user and real current password hash
     * @param password
     * @param passwordHash
     */
    async comparePasswords(password: string, passwordHash: string) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, passwordHash, function (err, valid) {
                if (err) return reject(err);
                return resolve(valid);
            });
        });
    }

    async hashPassword(password: string): Promise<string> {
        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(config.auth.saltFactor, function (err, salt) {
                if (err) return reject(err);

                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) return reject(err);
                    return resolve(hash);
                });
            });
        });
    }

    signToken(data: ITokenUser, options: jwt.SignOptions = { expiresIn: config.auth.expiresIn }, secret = config.auth.secret) {
        options.algorithm = this.ALGORITHM;
        return jwt.sign(data, secret, options);
    }

    async verifyToken(token: string, secret: string = config.auth.secret): Promise<any> {
        return new Promise((resolve, reject) => {
            let options: jwt.VerifyOptions = {
                algorithms: [this.ALGORITHM]
            };

            jwt.verify(token, secret, options, function (err, decoded) {

                if (err && err.name === 'TokenExpiredError') {
                    return reject(new Error('Token is expired'));
                }

                if ((err && err.name === 'JsonWebTokenError') || !decoded) {
                    return reject(new Error('Token is invalid'));
                }

                return resolve(decoded);
            });
        });
    }
}