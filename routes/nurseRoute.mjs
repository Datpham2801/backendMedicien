import nurseController from "../controllers/nurseController.mjs";

import {Router} from 'express'
const router = Router()

router.get('/medical' ,nurseController.getAllmedical)
router.put('/medical/update/:id' , nurseController.updateMedical)

export default router