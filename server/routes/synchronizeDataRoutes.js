import { UserModel } from '../models/userSchema.js';
import { parseRoutineData, parseTrainingLogData } from './parser/parseData.js';

export default async function (fastify, options) {
    fastify.addHook('onRequest', fastify.auth([fastify.verifyJWT]));

    fastify.patch('/saveToDatabase', {
        onError: async (request, reply, error) => {
            reply.code(500).send({ error });
        }
    }, async (request, reply) => {
        const transformedLogData = parseTrainingLogData(request.body.trainingLog);
        const transformedRoutineData = parseRoutineData(request.body.routine)
        const filter = { _id: request.user._id };
        const userData = await UserModel.findOne(filter).exec();

        const update = {
            trainingLog: transformedLogData.trainingLog, exercise: request.body.exercise,
            routine: transformedRoutineData.routine,
        };

        const userDataAfterUpdate = await UserModel.findOneAndUpdate(
            filter,
            update,
            { new: true },
        ).exec();

        await userDataAfterUpdate.save();

        reply.code(201).send({ message: 'Data updated successfully' });
    }); // save user training data to server database

    fastify.get('/getFromDatabase', {
        onError: async (request, reply, error) => {
            reply.code(500).send({ error });
        }
    }, async (request, reply) => {

        const userData = await UserModel.findOne({ _id: request.user._id }).exec();

        reply.code(200).send({ trainingLog:userData.trainingLog, exercise:userData.exercise, routine: userData.routine });

    }); // get user training data from server database

}