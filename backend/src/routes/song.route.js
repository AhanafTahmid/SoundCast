import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTradingSongs } from "../controller/song.controller.js";
import { protectRoute,requireAdmin} from "../middleware/auth.middleware.js"


const router = Router();

router.get("/",protectRoute,requireAdmin,getAllSongs);
router.get("/featured",getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trading", getTradingSongs)

export default router;