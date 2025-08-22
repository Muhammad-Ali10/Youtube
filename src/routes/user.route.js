import { Router } from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    refershAccessToken,
    updatepassword,
    getcurrentuser,
    updateaccountdetalis,
    updateaccountimage,
    UpdateCoverImage
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { varifyJWT } from "../middlewares/auth.middlerware.js";

const router = Router()

router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]),
    registerUser)

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(varifyJWT, logoutUser)
router.route("/refersh-token").post(refershAccessToken)
router.route("/update-password").post(varifyJWT, updatepassword)
router.route("/current-user").get(varifyJWT, getcurrentuser)
router.route("/update-account-detalis").patch(varifyJWT, updateaccountdetalis)
router.route("/update-account-image").patch(varifyJWT, upload.single("avatar"), updateaccountimage)
router.route("/update-cover-image").patch(varifyJWT, upload.single("coverImage"), UpdateCoverImage)

export default router