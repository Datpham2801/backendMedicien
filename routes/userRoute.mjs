import userController from "../controllers/userController.mjs";
import middlewareController from "../controllers/middlewareController.mjs";
import { Router } from "express";
import upload from "../utils/multerConfig.mjs";

const router = Router();

router.get("/", userController.getAllusers);
router.get("/:id", userController.getOneuser);
router.delete("/delete/:id", userController.deleteUser);
router.patch("/update/:id", upload.single("avatar"), userController.updateUser);
router.post("/medical/:idPatient", userController.registerMedical);
router.put("/:userId/timework", userController.updateUserTimework);
router.post("/adduser", upload.single("avatar"), userController.addUser);

export default router;
