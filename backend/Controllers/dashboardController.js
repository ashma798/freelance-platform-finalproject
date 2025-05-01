const mongoose = require('mongoose');
const jobModel = require("../Models/jobModel");
const proposalModel = require("../Models/proposalsModel");
const freelancerProfileModel = require("../Models/freelancerProfileModel");
const paymentModel = require("../Models/paymentModel");
const invitationModel = require("../Models/invitationModel");

getFreelancerCount = async (req, res) => {
    try {
        const clientId = req.userId;
        const hiredFreelancers = await invitationModel.distinct("freelancer_id", {
            client_id: clientId,
            status: "accepted",
            freelancer_id: { $ne: null }
        });


        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "freelancer retrieved successfully",
            count: hiredFreelancers.length,
            data: hiredFreelancers
        });
    } catch (err) {
        console.error("Error in getFreelancerCount:", err);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch freelancer"
        })
    }
},
getJobCount = async (req, res) => {
    try {
        const clientId = req.userId;
        const jobCount = await jobModel.distinct("_id", {
            client_id: clientId,
        });


        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "jobs retrieved successfully",
            count: jobCount.length,
            data: jobCount
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch jobs"
        })
    }
},
getOpenProjectCount = async (req, res) => {
    try {
        const clientId = req.userId;
        const prjtCount = await jobModel.countDocuments({
            client_id: clientId,
            status: {$in: ['pending','in-progress']},
        });


        return res.status(200).json({
          
            success: true,
            statusCode: 200,
            message: "open projects retrieved successfully",
            count: prjtCount,
            data: prjtCount
           
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch open projects"
        })
    }
},
getProposalCount = async (req, res) => {
    try {
        const clientId = req.userId;
        const proposalCount = await proposalModel.countDocuments({
            client_id: clientId,
            
        });


        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "proposals retrieved successfully",
            count: proposalCount,
            data: proposalCount
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch  proposals"
        })
    }
},
getPaymentCount = async (req, res) => {
    try {
        const clientId = req.user.id;
        const paymentCount = await paymentModel.countDocuments({
            client_id: clientId,
            status:{ $in : ['paid']},
            
        });


        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "payment retrieved successfully",
            count: paymentCount.length,
            data: paymentCount
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch  paymentCount"
        })
    }
};


module.exports = {
    
    getFreelancerCount,
    getJobCount,
    getOpenProjectCount,
    getProposalCount,
    getPaymentCount
};
