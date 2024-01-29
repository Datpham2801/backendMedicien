import doctorController from "../controllers/doctorController.mjs";
import {Router} from 'express'
import upload from '../utils/multerConfig.mjs';

const router = Router()

router.post('/prescription' , doctorController.prescription)
router.post('/registerDoctor' , upload.single('avatar'), doctorController.registerDoctor)

export default router