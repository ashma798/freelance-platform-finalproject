const mongoose = require('mongoose');
const jobModel = require("../Models/jobModel");
const userModel = require("../Models/userModel");
const proposalModel = require("../Models/proposalsModel");
const freelancerProfileModel = require("../Models/freelancerProfileModel");
const bidModel = require("../Models/bidModel");
const sendEmail = require("../Utils/sendEmail");

bid = async (req, res) => {
    try {
        const { freelancer_id, job_id, client_id, bid_amount } = req.body;

        if (job_id && client_id && freelancer_id) {

            const newBid = new bidModel({
                freelancer_id,
                client_id,
                job_id,
                bid_amount


            });
            await  newBid.save()
            await newBid.populate('client_id', 'name email');

            const client = newBid.client_id;
            const bidId = newBid._id;
            const freelancer = await userModel.findById(newBid.freelancer_id);
            console.log(freelancer);
          
            const freelancerName = freelancer.name;
            const freelancerEmail = freelancer.email;
 
            const acceptBidLink = `http://localhost:3000/Client/AcceptBid?jobId=${job_id}&freelancerId=${client_id}&clientId=${freelancer._id}&bidId=${bidId}`;
            await sendEmail({

                fromName: freelancerName,
                fromEmail: freelancerEmail,
                to: client.email,
                subject: `${freelancerName} has invited you to accept bid on a Project`,
                html: `
          <p>Hi ${client.name},</p>
        <p>Hello,</p>
        <p>${freelancerName} has invited you to accept bid on the  project. To view the project and accept the bid,  click the link below:</p>
        <p> <a href="${acceptBidLink}">View Project</a></p>
        <p>Best regards,</p>
        <p>Your Company</p>
        `,
            });
            return res.status(201).json({
                success: true,
                statusCode: 201,
                message: "Bid Accepted successfully",
            });



        } else {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        } 
    }catch (err) {
        console.log("eror:",err);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Internal Server Error"
        });
    }
},
    inviteFreelancer = async (req, res) => {
        try {
            const { freelancer_id, job_id } = req.body;
            const client_id = req.userId;
            // console.log('Incoming invite request:', { client_id, freelancer_id, job_id });
            if (client_id && freelancer_id && job_id) {

                const bidInvitation = new invitationModel({
                    client_id,
                    freelancer_id,
                    job_id
                });
                await bidInvitation.save()
                await bidInvitation.populate('freelancer_id', 'name email');

                const freelancer = bidInvitation.freelancer_id;
                const client = await userModel.findById(client_id);
                const clientName = client.name;
                const clientEmail = client.email;
                const acceptBidLink = `http://localhost:3000/Freelancer/Bid?jobId=${job_id}&freelancerId=${freelancer_id}&clientId=${client._id}`;
                await sendEmail({

                    fromName: clientName,
                    fromEmail: clientEmail,
                    to: freelancer.email,
                    subject: `${clientName} has invited you to bid on a Project`,
                    html: `
          <p>Hi ${freelancer.name},</p>
        <p>Hello,</p>
  <p>${clientName} has invited you to bid on a new project. To view the project  click the link below:</p>
  <p> <a href="${acceptBidLink}">View Project</a></p>
  <p>Best regards,</p>
  <p>Your Company</p>
        `,
                });
                return res.status(200).json({
                    success: true,
                    message: 'Invitation sent',
                });

            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                });
            }

        } catch (error) {
            console.error('Error in inviteFreelancer:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },
        freelancerProfile = async (req, res) => {
            try {
                const { freelancerId } = req.params;

                console.log("Received freelancerId:", freelancerId);
                const user = await userModel.findById(freelancerId).select('-password');
                console.log("Received user:", user._id);
                if (!user || user.role !== 'freelancer') {
                    return res.status(404).json({ message: 'Freelancer not found' });
                }
                const freelancerProfile = await freelancerProfileModel.findOne({ user_id: user._id });

                console.log("Received freelancer:", freelancerProfile);
                if (!freelancerProfile) {
                    return res.status(404).json({ message: 'Freelancer profile not found' });
                }
                const freelancerData = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    email: user.email,
                    country: user.country,
                    image: user.image,
                    // headline: freelancerProfile.headline,
                    // summary: freelancerProfile.summary,
                    skills: freelancerProfile.skills,
                    hourly_rate: freelancerProfile.hourly_rate,
                    portfolio: freelancerProfile.portfolio
                };
                console.log("freelan:", freelancerData);
                return res.status(200).json({
                    success: true,
                    data: freelancerData
                });

            } catch (error) {
                console.error('Error fetching freelancer profile:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error'
                });
            }
        },

        updateFreelancerProfile = async (req, res) => {
            try {
                const { freelancerId, updatedData } = req.body;

                const updatedProfile = await freelancerProfileModel.findByIdAndUpdate(
                    freelancerId,
                    updatedData,
                    { new: true }
                );

                if (!updatedProfile) {
                    return res.status(404).json({
                        success: false,
                        statusCode: 404,
                        message: "Profile not found"
                    });
                }

                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "Profile updated successfully",
                    data: updatedProfile
                });
            } catch (e) {
                res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: "Internal Server Error"
                });
            }
        },
        getFreelancers = async (req, res) => {

            try {
                const freelancers = await userModel.aggregate([
                    {
                        $match: { role: "freelancer" }
                    },
                    {
                        $lookup: {
                            from: "freelancerprofiles",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "profile"
                        }
                    },
                    {
                        $unwind: "$profile"
                    },
                    {
                        $project: {
                            name: 1,
                            username: 1,
                            email: 1,
                            country: 1,
                            phone: 1,
                            image: 1,
                            portfolio_links: "$profile.portfolio_links",
                            skills: "$profile.skills",
                            experience: "$profile.experience",
                            hourly_rate: "$profile.hourly_rate"
                        }
                    }
                ]);

                res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "Freelancer list fetched successfully",
                    data: freelancers
                });

            } catch (error) {
                console.error("Error fetching freelancers:", error);
                res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: "Failed to fetch freelancers",
                    error: error.message
                });
            }
        },

        addProposal = async (req, res) => {
            try {
                const { freelancer_id, job_id, cover_letter, proposed_budget, status } = req.body;

                if (freelancer_id && job_id && proposed_budget) {

                    const newProposal = new proposalModel({
                        freelancer_id,
                        job_id,
                        cover_letter,
                        proposed_budget,
                        status
                    });
                    newProposal.save()
                        .then((response) => {
                            console.log("response: ", response);

                            return res.status(201).json({
                                success: true,
                                statusCode: 201,
                                message: "Proposal added successfully",
                            });
                        })
                        .catch((error) => {
                            console.log("error: ", error);

                            return res.status(200).json({
                                success: false,
                                statusCode: 400,
                                message: "adding Proposal failed"
                            });
                        })

                } else {
                    return res.status(200).json({
                        success: false,
                        statusCode: 400,
                        message: "Missing required fields"
                    });
                }

            } catch (err) {
                res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: "Internal Server Error"
                });
            }
        },
        myProposal = async (req, res) => {
            try {
                const freelancerId = req.freelancerId;

                const proposals = await proposalModel.find({ freelancer_id: freelancerId })
                    .populate('job_id')
                    .populate('freelancer_id');

                if (!proposals.length) {
                    return res.status(404).json({
                        success: false,
                        statusCode: 404,
                        message: "No proposals found for this freelancer"
                    });
                }

                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "Proposals retrieved successfully",
                    data: proposals
                });

            } catch (error) {
                return res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: "Internal Server Error"
                });
            }
        },
        viewProposals = async (req, res) => {
            try {
                const allProposals = await proposalModel.find();

                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "Proposals retrieved successfully",
                    count: allProposals.length,
                    data: allProposals
                });
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: "Failed to fetch proposals"
                })
            }
        },
        deleteJob = async (req, res) => {
            try {
                const { jobId } = req.body;
                console.log("Api call:", jobId);

                if (!jobId) {
                    return res.status(400).json({
                        success: false,
                        statusCode: 400,
                        message: "Job ID is required",
                    });
                }

                const deletedJob = await jobModel.findByIdAndDelete(jobId);
                console.log("jb:", deletedJob);

                if (!deletedJob) {
                    return res.status(404).json({
                        success: false,
                        statusCode: 404,
                        message: "Job not found",
                    });
                }

                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "Job deleted successfully",
                    data: deletedJob
                });

            } catch (e) {
                return res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: `Internal Server Error: ${e.message}`
                });
            }
        },
        updateJob = async (req, res) => {
            try {
                const { jobId, updatedData } = req.body;

                const updatedJob = await jobModel.findByIdAndUpdate(
                    jobId,
                    updatedData,
                    { new: true }
                );

                if (!jobId) {
                    return res.status(404).json({
                        success: false,
                        statusCode: 404,
                        message: "job not found"
                    });
                }

                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "job updated successfully",
                    data: updatedJob
                });
            } catch (e) {
                console.error("Update error:", e);
                res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: "Internal Server Error"
                });
            }
        };
      
    module.exports = {
        freelancerProfile,
        inviteFreelancer,
        bid,
        updateFreelancerProfile,
        addProposal,
        myProposal,
        viewProposals
      

    };