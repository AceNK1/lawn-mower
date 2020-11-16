import dotenv from 'dotenv';
import { LawnHandler } from './lawn-handler';

dotenv.config({ path: '../config/.env'});
const handler = new LawnHandler();
const inputFile = process.env.INPUT_PATH || '../files/input';
const outputFile = process.env.INPUT_PATH || '../files/output';
handler.parseAndExecute(inputFile, outputFile);
