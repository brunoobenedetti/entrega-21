import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import UserModel from './dao/models/user.model.js';


const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export class Exception extends Error {
    constructor(message, status) {
        super(message)
        this.statusCode = status
    }
}

export const tokenGenerator = (user) => {
    const { _id, first_name, last_name, email } = user;
    const payload = {
        id: _id,
        first_name,
        last_name,
        email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' });
    }

const JWT_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@';

export const jwtAuth = (req, res, next) => {
    const { authorization: token } = req.headers;
    if (!token) {
        return res.status(401).json({ message: 'unauthorized' });
    }
jwt.verify(token, JWT_SECRET, async (error, payload) => {
    if (error) {
        return res.status(403).json({ message: 'No authorized' });
    }
        req.user = await UserModel.findById(payload.id);
        next();
    });
}

export const bsonToObject = (bson) => {
    return bson.map(m => { return {...m._doc} }) 
}

export const getLinkToPage = (req, page) => {
    let currentLink = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    if(req.query.page) {
        return currentLink.replace(`page=${req.query.page}`, `page=${page}`)
    }
    
    if(Object.keys(req.query).length !== 0) {
        return currentLink + `&page=${page}`
    }
    
    return currentLink + `?page=${page}`
}








