export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
  }
  
  export type UserWithoutPassword = Omit<IUser, 'password'>; 