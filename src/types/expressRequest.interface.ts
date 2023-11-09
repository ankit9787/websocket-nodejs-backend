import { Request } from "express";
import { UserDocument } from "./user.interface";

export interface ExpressInterfaceRequest extends Request {
    user? : UserDocument;
}