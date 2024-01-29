import medicineController from "../controllers/Medicine.mjs";
import middlewareController from "../controllers/middlewareController.mjs";
import upload from '../utils/multerConfig.mjs'
import {Router} from 'express'
const router = Router()

router.post('/add' ,  upload.single('image') ,  medicineController.addMedicine)
router.get('/' , medicineController.getAllmedicine)
router.delete('/delete/:id' ,  medicineController.deleteMedicine)
router.patch('/update/:id' ,   upload.single('image'),  medicineController.updateMediciner)
router.get('/detail/:id' , medicineController.getOnemedicine )

export default router

