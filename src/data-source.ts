import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin',
    database: "typeorm_db",
    synchronize: true,
    logging: false,
    migrationsTableName: 'migrations',
    migrationsRun: true,
    subscribers: [],
    entities: [
        __dirname + "/entity/*.js"
    ],
})
