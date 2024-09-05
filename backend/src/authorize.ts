import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomUser } from "./types/custom";

export const authorize = (allowedRoles: number[]) => {
  return (req: CustomUser, res: Response, next: NextFunction) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, "jwtSecret") as {
        id: number;
        roleId: number;
      };
      // console.log("Decoded roleId:", decoded.roleId);
      // console.log("Decoded userId:", decoded.id);
      if (!allowedRoles.includes(decoded.roleId)) {
        return res.status(403).json({ msg: "Access denied" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};
