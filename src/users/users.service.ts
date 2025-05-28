import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
    //Filtrar los que tengan eliminado false.
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({idUser: id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({idUser: id}, updateUserDto)
  } //Revisar si conviene un Patch o un Put

  remove(id: number) {
    return this.userRepository.delete({idUser:id});
  } //En vez de un delete, vamos a usar un patch y cambiarle una propiedad eliminado a true.
}
