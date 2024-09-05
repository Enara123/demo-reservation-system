import { Request } from "express";

export interface CustomUser extends Request {
  user?: {
    id: number;
    roleId: number;
  };
}
