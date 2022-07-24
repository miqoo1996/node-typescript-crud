import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import {UserService} from "./src/service/UserService";
import {optionalName, userFields} from "./src/validation/userValidation";
import FirstErrorCheckMiddleware from "./src/middleware/FirstErrorCheckMiddleware";
import {AppDataSource} from "./src/data-source";

const cors = require('cors');

dotenv.config();

AppDataSource.initialize().then(() => console.log("Database connected!")).catch((e) => console.log("Error connecting Database:", e));

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser());

app.get('/', (req: Request, res: Response) => {
    return res.json({});
});

app.get('/user', optionalName, FirstErrorCheckMiddleware, async (req: Request, res: Response) => {
    const userService = new UserService();

    res.json( await userService.findUserByFullName(req.body.name || "") );
});

app.post('/user', userFields, FirstErrorCheckMiddleware, async (req: Request, res: Response) => {
        const userService = new UserService();

        await userService.saveUser(req.body);

        res.json({ message: "saved!", usersCount: await userService.getAllUsersCount() })
    },
);

app.put('/user/:id', userFields, FirstErrorCheckMiddleware, async (req: Request, res: Response) => {
        const userService = new UserService();

        await userService.saveUser({
            ...req.body,
            id: req.params.id,
        });

        res.json({ message: "saved!", usersCount: await userService.getAllUsersCount() })
    },
);

app.delete('/user/:id', async (req: Request, res: Response) => {
        const userService = new UserService();

        await userService.deleteById(req.params.id);

        return res.json({ message: "deleted!" })
    },
);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});