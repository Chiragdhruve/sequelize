import { HttpException , BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import  { Op } from 'sequelize';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return user.save();
  }

  async findAll(): Promise<User[]> {
    // try {
    //   await this.sequelize.transaction(async t => {
    //     const transactionHost = { transaction: t };

    //     await this.userModel.create(
    //       { firstName: 'Admin', lastName: '1' },
    //       transactionHost,
    //     );
    //     await this.userModel.create(
    //       { firstName: 'Super_Admin', lastName: '2' },
    //       transactionHost,
    //     );
    //   });
    // } catch (err) {
   //}
   const amount = await this.userModel.count({
    where: {
      id: {
        [Op.gt]: 0
      }
    }
  });
  console.log(`There are ${amount} users`);
    return this.userModel.findAll();
  }
  findOne(id: string): Promise<User> {
    const user = this.userModel.findOne({
      where: {
        id,
      },
    });
    if(user === null){
      throw new BadRequestException("No user found");
    } else{
      return user;
    }
    
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
