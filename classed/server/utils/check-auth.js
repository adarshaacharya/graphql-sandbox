// middleware

import { AuthenticationError } from 'apollo-server';

import { verify } from 'jsonwebtoken';

export default (context) => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = verify(token, 'SECRET_KEY');
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error('Authorization header must be provided');
};


// user login -> get authentication token(JWT) froms erver -> put that token in authorization header and send that header in every req -> server decode that token and get info from token like id, username ->  server make sure that user is authenticated by using the next() else throw the error 