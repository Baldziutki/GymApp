import { build } from "./server.js";

const fastify = build();

try {
    await fastify.listen({ port: 3000 });
    console.log('Server started successfully');
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}

