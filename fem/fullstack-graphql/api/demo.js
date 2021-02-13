const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const typeDefs = gql`
  type User {
    email: String!
    avatar: String
    friends: [User]!
  }

  type Query {
    me: User!
    friends : [User]!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        email: 'yoda@masters.com',
        avatar: 'http://oda.png',
        friends: [],
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4000).then(() => console.log('On port 4000'));
