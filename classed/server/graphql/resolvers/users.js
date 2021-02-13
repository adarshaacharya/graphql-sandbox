import { UserInputError } from 'apollo-server';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { User } from '../../models/User';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../../utils/validators';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    'SECRET_KEY',
    { expiresIn: '1h' }
  );
}

export const usersResolvers = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //  check user exists
      const user = await User.findOne({ username });
      if (user)
        throw new UserInputError('Username is taken', {
          erros: {
            username: 'This username is taken',
          },
        });

      // validate inputs
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
