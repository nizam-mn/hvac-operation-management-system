import express from 'express';
import { register, login, logout, getCurrentUser } from './auth.controller.js';
import validate from '../../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import verifyJWT from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', verifyJWT, getCurrentUser);

export default router;