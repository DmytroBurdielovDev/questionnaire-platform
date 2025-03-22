import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
});

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
