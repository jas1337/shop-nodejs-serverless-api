import { Injectable } from "@nestjs/common";

import { v4 } from "uuid";

import { User } from "../models";
import { User as UserEntity } from "../../database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

@Injectable()
export class UsersService {
  private readonly users: Record<string, User>;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<User>
  ) {
    this.users = {};
  }

  async findOne(userName: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        name: userName,
      },
    });
  }

  async createOne({ name, password }: User): Promise<User> {
    const user = this.userRepository.create({
      id: v4(v4()),
      name,
      password,
    });
    return await this.userRepository.save(user);
  }
}
