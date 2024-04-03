import {after, before, describe, it} from "node:test";
import assert from "node:assert";
import { build } from "../server.js";
import mongoose from "mongoose";

let fastify;

describe('Integration tests', () => {

  before(async () => {
    try{
      fastify = build({dbName:'test2'});
      await fastify.ready();
      await mongoose.connection.db.dropDatabase();
    }catch(error){
      console.log(error);
      throw error;
    }

  });

  after(async () => {
    await mongoose.connection.close();
  })

  it('201 on register user',async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {email: 'testing@email.com', password: 'test123'},
    });
    assert.strictEqual(response.statusCode, 201);
  });

  it('400 on register existing user user', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {email: 'testing@email.com', password: 'test123'},
    });
    assert.strictEqual(response.statusCode, 400);
  });

  it('201 on save trainig data', async () => {
    const trainingLog = [{"08-12-2023":{"Calf raises":{"series":[{"id":1702333464018,"weight":"16.53","reps":"2"},{"id":1702333463232,"weight":"16.53","reps":"2"}]},"Military press":{"series":[{"id":1702410824458,"weight":"1.13","reps":"1"}]}}}]
    const exercises = [{"name":"Calf raises","category":"Legs","type":"weight - reps","description":""},{"name":"Incline Bench Press","category":"Chest","type":"weight - reps","description":""}]
    const routines = [{"push":[{"name":"Incline Bench Press","category":"Chest","type":"weight - reps","description":""},{"name":"bench press","category":"Chest","type":"weight - reps","description":""}]}]

    const loginResponse = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {email: 'testing@email.com', password: 'test123'},
    })
    const { token } = await loginResponse.json();
    const response = await fastify.inject({
      method: 'PATCH',
      url: '/saveToDatabase',
      headers: { 'Authorization': `Bearer ${token}`},
      payload: {trainingLog: trainingLog, exercise: exercises, routine: routines}
    });
    assert.strictEqual(response.statusCode, 201);
  });

});