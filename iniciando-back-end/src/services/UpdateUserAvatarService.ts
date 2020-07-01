import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    // Have access to the users repo
    const usersRepository = getRepository(User);
    // Find user by id on the database through the repo
    const user = await usersRepository.findOne(user_id);

    // Check if user doesn't exist
    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    // Check if user already has an avatar
    if (user.avatar) {
      // Get the location of the image
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // Check if that image exists using promise
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        // Delete the image
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Add new image to user field avatar
    user.avatar = avatarFileName;

    // Update user data on the database
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
