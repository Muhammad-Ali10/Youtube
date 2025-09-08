import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js"
import { varifyJWT } from "../middlewares/auth.middlerware.js"
import {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.contoller.js"

const router = Router()

router.route("/upload-video").post(varifyJWT,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo)

router.route("/get-video/:videoId").get(getVideoById)
router.route('/update-videoDetails/:videoId').patch(varifyJWT, upload.single("thumbnail"), updateVideo)
router.route("/delete-video/:videoId").post(varifyJWT, deleteVideo)
router.route("/toggle-publish-status/:videoId").post(varifyJWT, togglePublishStatus)

export default router