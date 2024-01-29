import MedicalController from "../controllers/medicalController.mjs";
import {Router} from 'express'
import upload from '../utils/multerConfig.mjs';

const router = Router()

router.get('/' , MedicalController.getAllMedical)
router.delete('/delete/:id' , MedicalController.deleteMedical)
router.get('/:id' ,MedicalController.getMedicalById)
router.patch('/update/:id' , MedicalController.updateMedical)
router.get('/download/:id' , MedicalController.downloadPDF)
router.patch('/updatequanity/:id' , MedicalController.updateMedicineQuantity)

export default router