import { UserModel } from '../models/userSchema.js';
import bcrypt from 'bcrypt';

export default async function (fastify, options) {

    fastify.post('/auth/register', {
        onError: async (request, reply, error) => {
          if (error.name === 'ValidationError') {
            reply.code(400).send({ error: error.message });
          }
          reply.code(500).send({ error });
          console.log(error);
        }
      }, async (request, reply) => {
    
        const { email, password } = request.body;
        const hashPassword = await bcrypt.hash(password, 10);
    
        const newUser = new UserModel({ email, password: hashPassword });
    
        await newUser.save();
    
        reply.code(201).send({ message: 'User created successfully' });
      }); // register

      fastify.post('/auth/login', {
        onError: async (request, reply, error) => {
          reply.code(500).send({ error });
          console.log(error);
    
          done();
        }
      }, async (request, reply) => {
        const { email, password } = request.body;
    
        const user = await UserModel.findOne({
          email,
        }).exec();
    
        if (!user) {
          return reply.code(404).send({ message: "User not found", code: 404 });
        }
    
        const validPassword = await bcrypt.compare(password, user.password);
    
        if (validPassword) {
            const token = await fastify.jwt.sign({ _id: user._id, email: email });
            return reply.code(201).send({ token: token});
        } else {
          return reply.code(404).send({ message: "Wrong password", code: 404 });
        }
    
      }); //log in
}