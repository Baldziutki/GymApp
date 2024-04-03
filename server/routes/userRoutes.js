import { UserModel } from '../models/userSchema.js';
import bcrypt from 'bcrypt';

export default async function (fastify, options) {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));


    fastify.patch('/changePassword', {
        onError: async (request, reply, error) => {
            if (error.name === 'ValidationError') {
                reply.code(400).send({ error: error.message });
            }
            reply.code(500).send({ error });
            console.log(error);
        }
    }, async (request, reply) => {
        const { newPassword, oldPassword } = request.body;
        const filter = { _id: request.user._id };

        const userData = await UserModel.findOne(filter).exec();

        const validPassword = await bcrypt.compare(oldPassword, userData.password);

        if (!validPassword) {
            return reply.code(400).send({code:400,  message: "Wrong password" });
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        const update = { password: hashNewPassword };

        await UserModel.findOneAndUpdate(filter, update, { new: true }).exec();

        return reply.code(200).send({ message: 'Password changed successfully!' });
    });// change user password
    fastify.patch('/changeEmail', {
        onError: async (request, reply, error) => {
            if (error.name === 'ValidationError') {
                reply.code(400).send({ error: error.message });
            }
            reply.code(500).send({ error });
            console.log(error);
        }
    }, async (request, reply) => {
        const { newEmail, password } = request.body;
        const filter = { _id: request.user._id };

        const existingUser = await UserModel.findOne({ email: newEmail });
        const userData = await UserModel.findOne(filter);

        if (existingUser) {
            return reply.code(409).send({ code:409, message: 'Email already exists' });
        }

        const validPassword = await bcrypt.compare(password, userData.password);

        if (!validPassword) {
            return reply.code(400).send({ code:400, message: "Wrong password" });
        }

        await UserModel.findOneAndUpdate(filter, { email: newEmail }, { new: true }).exec();

        return reply.code(200).send({ message: 'Email changed successfully!' });
    });// change user email
    fastify.delete('/deleteAccount', {
        onError: async (request, reply, error) => {
            if (error.name === 'ValidationError') {
                reply.code(400).send({ error: error.message });
            }
            reply.code(500).send({ error });
            console.log(error);
        }
    }, async (request, reply) => {

        const filter = { _id: request.user._id };

        const userData = await UserModel.findOne(filter);
        const validPassword = await bcrypt.compare(request.body.password, userData.password);

        if (!validPassword) {
            return reply.code(400).send({ code: 400, message: "Wrong password" });
        }

        await UserModel.findOneAndDelete(filter).exec();

        return reply.code(200).send({ message: 'Deleted account successfully!' });
    });// delete user account
}