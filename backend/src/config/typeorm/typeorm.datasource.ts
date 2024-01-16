import { DataSource } from 'typeorm';
import ormConfig from './typeorm.config';

export default new DataSource(ormConfig());
