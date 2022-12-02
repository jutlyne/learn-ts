import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  password: string;
  avatar?: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true},
  password: { type: String, required: true },
  avatar: String
});

export default model<IUser>('User', userSchema);
