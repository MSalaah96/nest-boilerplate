import { config } from 'dotenv';

config();
import { Server } from './server';

const instance = new Server();

instance.start();
