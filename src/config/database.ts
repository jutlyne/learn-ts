import { connect } from 'mongoose';

export async function connectToDatabase () {
  const dbConnect: any = process.env.DB_CONN_STRING;

  await connect(dbConnect);
}
