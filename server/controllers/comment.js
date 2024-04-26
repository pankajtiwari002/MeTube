import Comment from "../models/Comment.js";
import Video from "../models/Video.js"
import { createError } from "../error.js";

export const addComment = async (req,res,next) => {
    try{
        const newComment = new Comment({
            ...req.body,
            userId: req.user.id   
        })
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    }catch(err){
        next(err);
    }
}

export const deleteComment = async (req,res,next) => {
    try{
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(comment.videoId)
        if(comment.userId === req.user.id || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("The comment has been deleted.");
        }else{
            return next(createError(403,"You can delete only your comment!"));
        }
    }catch(err){
        next(err);
    }
}

export const getComment = async (req,res,next) => {
    try{
        const comments = await Comment.find({videoId: req.params.videoId})
        res.status(200).json(comments);
    }catch(err){
        next(err);
    }
}