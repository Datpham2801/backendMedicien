import { Router } from 'express';
import authController from '../controllers/authControllers.mjs';
import middlewareController from '../controllers/middlewareController.mjs';

import upload from '../utils/multerConfig.mjs';

const router = Router();

router.post("/register", upload.single('avatar') , authController.registerUser)
router.post("/login" , authController.login)

export default router;