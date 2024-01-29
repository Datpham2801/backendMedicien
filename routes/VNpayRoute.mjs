import { createOrder  } from "../controllers/VNpay.mjs";

import { Router } from "express";

const router = Router();

router.post('/' , createOrder)

export default router