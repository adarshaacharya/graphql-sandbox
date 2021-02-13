import Mongoose from 'mongoose';

export const connectDB = () => {
  Mongoose.connect('mongodb://localhost/classed', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to database successfully...'))
    .catch(() => console.log('Failed to connect to database...'));
};
