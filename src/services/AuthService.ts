import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { UserRepository } from '../repositories/UserRepository';

// jsonwebtoken é padrão, mas jwt-simple é um typo meu. O package jsonwebtoken foi instalado.
// Vou reescrever usando jsonwebtoken.
import jsonwebtoken from 'jsonwebtoken';

const userRepository = new UserRepository();

export class AuthService {
  async register(name: string, email: string, passwordPlain: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    const user = await userRepository.create({ name, email, passwordHash });
    
    // Nao retornar o hash da senha
    return { id: user._id, name: user.name, email: user.email };
  }

  async login(email: string, passwordPlain: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      user: {
        id: user._id
      }
    };

    const token = jsonwebtoken.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return { token, user: { id: user._id, name: user.name, email: user.email } };
  }
}
