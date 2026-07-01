import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIAPITResponse from '../utils/openai.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

//test
router.post("/test",async(req,res)=>{
    try
    {
        const thread=new Thread({
            threadId:"456789012",
            title:"Test Thread 1",
        });
        const response=await thread.save();
        res.send(response);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Failed to save in DB");
    }
});

//Get all threads
router.get("/thread",authMiddleware,async(req,res)=>{
    try{
        const threads=await Thread.find({userId:req.userId}).sort({updatedAt:-1});
        //descending order of updatedAt... most recent data on top
        res.json(threads);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Failed to fetch threads");
    }
})

router.get("/thread/:threadId",authMiddleware,async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId,userId:req.userId});
        if(thread)
        {
            res.json(thread.messages);
        }
        else
        {
            res.status(404).send("Thread not found");
        }
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Failed to fetch thread");
    }
});

router.delete("/thread/:threadId",authMiddleware,async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOneAndDelete({threadId,userId:req.userId});
        if(!thread)
        {
            res.status(404).send("Thread not found");
        }
        else
        {
            res.status(200).json({success:"Thread deleted successfully"});
        }
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Failed to delete thread");
    }
});

router.post("/chat",authMiddleware,async(req,res)=>{
    const {threadId,message}=req.body;
    if(!threadId || !message)
    {
        return res.status(400).send("ThreadId and message are required");
    }
    try
    {
        let thread=await Thread.findOne({threadId,userId:req.userId});

        if(!thread)
        {
            //create new thread
            thread=new Thread({
                threadId,
                userId:req.userId,
                title:message,
                messages:[{role:"user",content:message}],
                // createdAt:Date.now()
            })
        }
        else
        {
            thread.messages.push({role:"user",content:message});
        }

        const assistantReply=await getOpenAIAPITResponse(message);

        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt=Date.now();
        await thread.save();
        res.json({reply:assistantReply});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Something went wrong while processing the request");
    }
})

export default router;