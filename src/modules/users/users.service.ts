import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  private async isEmailTaken(email: string, excludeUuid?: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    return user && user.userUuid !== excludeUuid;
  }

  async createUser(dto: CreateUserDto) {
    if (await this.isEmailTaken(dto.email)) {
      throw new BadRequestException('Email already exists');
    }

    const password = dto.password || `Pass-${Math.floor(100000 + Math.random() * 900000)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      userType: dto.userType,  
      mappedId: dto.mappedId,  
    });

    const savedUser = await this.userRepo.save(user);
    return this.transform(savedUser);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, totalCount] = await this.userRepo.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users.map(u => this.transform(u)),
      totalCount,
      page,
      limit,
    };
  }

  async findOne(uuid: string) {
    const user = await this.userRepo.findOne({ where: { userUuid: uuid } });
    if (!user) throw new NotFoundException('User not found');
    return this.transform(user);
  }

  async updateUser(uuid: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { userUuid: uuid } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && (await this.isEmailTaken(dto.email, uuid))) {
      throw new BadRequestException('Email already exists');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    const updated = await this.userRepo.save(user);
    return this.transform(updated);
  }

  async deleteUser(uuid: string) {
    const user = await this.userRepo.findOne({ where: { userUuid: uuid } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.remove(user);
    return { message: 'User deleted successfully' };
  }

  async deactivateUser(uuid: string) {
    const user = await this.userRepo.findOne({ where: { userUuid: uuid } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = false;
    return this.transform(await this.userRepo.save(user));
  }

  async activateUser(uuid: string) {
    const user = await this.userRepo.findOne({ where: { userUuid: uuid } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    return this.transform(await this.userRepo.save(user));
  }

  private transform(user: User) {
    return {
      uuid: user.userUuid,
      email: user.email,
      userType: user.userType,
      mappedId: user.mappedId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
