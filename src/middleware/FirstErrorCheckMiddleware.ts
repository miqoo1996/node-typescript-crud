import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

const FirstErrorCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    return next();
};

export default FirstErrorCheckMiddleware;