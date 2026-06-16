import express from 'express';
import Thread from '../models/Thread.js';

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
router.get("/thread",async(req,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});
        //descending order of updatedAt... most recent data on top
        res.json(threads);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Failed to fetch threads");
    }
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId});
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

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOneAndDelete({threadId});
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

export default router;