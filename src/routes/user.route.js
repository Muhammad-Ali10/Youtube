import { Router } from "express"
import { registerUser, loginUser, refershAccessToken } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlewares.js"
const router = Router()

router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]),
    registerUser)

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(jwt.verifyJWT, logoutUser)
router.route("/refersh-token").post(refershAccessToken)
export default router