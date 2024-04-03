import Fastify from 'fastify';
import { connectToDatabase } from './db/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import fastifyJwt from '@fastify/jwt';
import fastifyAuth from '@fastify/auth';
import synchronizeDataRoutes from './routes/synchronizeDataRoutes.js';
import userRoutes from './routes/userRoutes.js';

export const build = ({dbName}={}) => {
    const fastify = Fastify({
        logger: true
    });

    fastify.register(fastifyAuth);
    fastify.register(fastifyJwt, {
        secret: 'supersecret',
        sign: {
            expiresIn: 0,
        },
    });
    fastify.decorate('verifyJWT', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.send(error);
        }
    });

    fastify.register(connectToDatabase,{dbName});
    fastify.register(authRoutes);
    fastify.register(userRoutes);
    fastify.register(synchronizeDataRoutes);

    return fastify;
}
