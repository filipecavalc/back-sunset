import { DataSource } from 'typeorm';
import { Product } from './entity/Product';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Product, User],
  migrations: [],
  subscribers: [],
});

export async function initializeDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!');
    } catch (err) {
      console.error('Error during Data Source initialization:', err);
      throw err;
    }
  }
}