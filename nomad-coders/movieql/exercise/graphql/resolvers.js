import {
  getById,
  people,
  getMovieById,
  getMovies,
  addMovie,
  deleteMovie,
} from '../db';

export const resolvers = {
  Query: {
    movies: () => getMovies(),
    movie: (_, { id }) => getMovieById(id),
  },

  Mutation: {
    addMovie: (_, { name, score }) => addMovie(name, score),
    deleteMovie: (_, { id }) => deleteMovie(id),
  },
};
