import Jwt, { JwtPayload } from 'jsonwebtoken';
import { secret } from '../../config/auth.config';
import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {

  const token = req.header('Authorization');
  
  Jwt.verify( token!, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    req.body.id = (decoded as JwtPayload).id;
    next(); 
  });
};

export {verifyToken};