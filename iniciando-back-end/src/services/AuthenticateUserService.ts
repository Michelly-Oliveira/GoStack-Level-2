import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    // Have access to the users repository so we can check the email and password
    const usersRepository = getRepository(User);

    // Find user by email
    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      // For security reasons, don't specify that the email was wrogn/ didn't match the password
      // Always give a more general error to avoid someone from trying to guess the emial/password
      throw new AppError('Incorrect email/password combination', 401);
    }

    // user.password = senha criptografada
    // password = senha não criptografada
    // compare = compara uma senha criptografada com uma senha não criptografada
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    // sign() => first param = payload, second param = secret key, third param = token config
    const token = sign({}, secret, {
      // know the user that created the token
      subject: user.id,
      // when the user will have to login again
      expiresIn,
    });

    // User successfully authenticated
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
