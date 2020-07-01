// dependency needed by typeorm
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes/index';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

// only loads the file, it doesn't pass any data to a variable. Make the connection with the database
import './database/index';

const app = express();

app.use(express.json());
// Route to serve statice files
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Check if the error was created by our app(user) - known error
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Make it easier to debug error
  console.log(err);

  // If we don't know the error(something we weren't expecting), return a more general error message
  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333');
});
