import { ApolloServer, PubSub } from 'apollo-server';
import { connectDB } from './db';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }), // for middleware -> so we can use it in resolvers
});

connectDB();

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
