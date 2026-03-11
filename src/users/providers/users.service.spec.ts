import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { HashingProvider } from './../../auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;
  const user = {
    email: 'john@doe.com',
    firstName: 'John',
    password: 'password',
    lastName: 'Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn(() => user.password),
          },
        },
        {
          provide: MailService,
          useValue: { sendEmail: jest.fn(async () => Promise.resolve()) },
        },
        {
          provide: UsersCreateManyProvider,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser method', () => {
    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });

    it('should create user in db', async () => {
      usersRepository.findOneBy?.mockReturnValue(null);
      usersRepository.create?.mockReturnValue(user);
      usersRepository.save?.mockReturnValue(user);

      const newUser = await service.createUser(user);

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        email: user.email,
      });
      expect(usersRepository.create).toHaveBeenCalledWith(user);
      expect(usersRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw bad request exception if user exists in db', async () => {
      usersRepository.findOneBy?.mockReturnValue(user);
      usersRepository.create?.mockReturnValue(user);
      usersRepository.save?.mockReturnValue(user);

      try {
        const newUser = await service.createUser(user);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
