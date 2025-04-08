import { Router } from "express";

const router = Router();

router.get("/",(req,res) => {
    res.send("song route with Get method")
})

export default router;