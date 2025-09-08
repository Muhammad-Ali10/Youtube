import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { fileUploader } from "../utils/cloudinary.js"
import { fileDelete } from "../utils/deleteCloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const owner = req.user;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }


    if (!req.files || !req.files.video || !req.files.thumbnail) {
        throw new ApiError(400, "Video and thumbnail are required");
    }

    const videoLocalPath = req.files.video?.[0]?.path;
    const thumbnailLocalPath = req.files.thumbnail?.[0]?.path;

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "File paths are missing");
    }


    const [videoDetail, thumbnailDetail] = await Promise.all([
        fileUploader(videoLocalPath),
        fileUploader(thumbnailLocalPath)
    ]);

    if (!videoDetail || !thumbnailDetail) {
        throw new ApiError(500, "File upload failed");
    }

    const video = await Video.create({
        video: videoDetail.url,
        thumbnail: thumbnailDetail.url,
        videopublicid: videoDetail.public_id,
        thumbnailpublicid: thumbnailDetail.public_id,
        owner: owner._id,
        isPublished: false,
        title,
        description,
        duration: videoDetail.duration
    });

    if (!video) {
        throw new ApiError(500, "Video could not be published");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, video, "Video published successfully")
        );
});


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(404, "Id is invalid")
    }

    const video = await Video.findById(videoId).select("title description thumbnail url createdAt views").populate("owner", "fullName avatar")

    if (!video) {
        throw new ApiError(404, "SomeThing went wrong")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video Scussfully find"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const { title, description } = req.body;

    //TODO: update video details like title, description, thumbnail


    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    if (!req.file?.path) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const thumbnail = await fileUploader(req.file.path);

    if (!thumbnail) {
        throw new ApiError(500, "Thumbnail upload failed");
    }

    if (video.thumbnailpublicid) {
        try {
            await fileDelete(video.thumbnailpublicid, "image");
        } catch (err) {
            console.error("Old thumbnail delete failed:", err.message);
        }
    }

    video.title = title;
    video.description = description;
    video.thumbnail = thumbnail.url;
    video.thumbnailpublicid = thumbnail.public_id;

    const updatedVideo = await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedVideo.toObject(), "Video updated successfully")
        );
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const deleteVideo = await Video.findByIdAndDelete(videoId)


    const oldvideopublicid = deleteVideo?.videopublicid
    const oldthumbnailpublicid = deleteVideo?.thumbnailpublicid

    console.log(oldvideopublicid, oldthumbnailpublicid)


    if (!deleteVideo) {
        throw new ApiError(500, "Some thing went wrong")
    }

    if (!oldvideopublicid || !oldthumbnailpublicid) {
        throw new ApiError(500, "Some thing went wrong")
    }

    await Promise.all([
        fileDelete(oldvideopublicid, "video"),
        fileDelete(oldthumbnailpublicid, "image")
    ])

    return res.status(200).json(new ApiResponse(200, {}, "Video Deleted"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }

    const video = await Video.findById(videoId)

    if(!video)
    {
        new ApiError(404,"Video Not Found")
    }

    video.isPublished = !video.isPublished
    const updatedVideo = await video.save()

    if(!updatedVideo){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video Published"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}