import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
      },
    }
  );

const dbBootstrap = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connected!');
    } catch (error) {
        logger.error('Database connection error:', error);
        process.exit(1);
    }
};

dbBootstrap();

export default sequelize;
