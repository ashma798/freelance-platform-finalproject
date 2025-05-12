const mongoose = require('mongoose');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const jobModel = require("../Models/jobModel");
const clientProfileModel = require("../Models/clientProfileModel");
const freelancerProfileModel = require("../Models/freelancerProfileModel");
const reviewModel = require("../Models/reviewModel");
const bidModel = require("../Models/bidModel");
const walletModel = require("../Models/walletModel");
const invitationModel = require("../Models/invitationModel");
const sendEmail = require("../Utils/sendEmail");
const userModel = require("../Models/userModel");
const messageModel = require('../Models/messageModel');

addJob = async (req, res) => {
    try {
        const { title, description, budget, skillsInput, deadline } = req.body;
        const client_id = req.userId;

        if (client_id && title && description && budget && skillsInput && deadline) {

            const newJob = new jobModel({
                client_id,
                job_title: title,
                description,
                budget,
                skills_required: skillsInput.split(',').map(skill => skill.trim()),
                deadline

            });
            newJob.save()
                .then((response) => {
                    console.log("response: ", response);

                    return res.status(201).json({
                        success: true,
                        statusCode: 201,
                        message: "Jobs added successfully",
                    });
                })
                .catch((error) => {
                    console.log("error: ", error);

                    return res.status(200).json({
                        success: false,
                        statusCode: 400,
                        message: "adding new job failed"
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

    viewJob = async (req, res) => {
        try {
            const allJobs = await jobModel.find();

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Jobs retrieved successfully",
                count: allJobs.length,
                data: allJobs
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Failed to fetch jobs"
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
    },
    addReview = async (req, res) => {
        try {
            //console.log("Received data:", req.body);
            const { reviewer_id, reviewee_id, start_date, end_date, rating, comment } = req.body;

            if (reviewer_id && reviewee_id && rating) {

                const newReview = new reviewModel({
                    reviewer_id,
                    reviewee_id,
                    start_date,
                    end_date,
                    rating,
                    comment,

                });
                newReview.save()
                    .then((response) => {
                        console.log("response: ", response);

                        return res.status(201).json({
                            success: true,
                            statusCode: 201,
                            message: "Review  and Rating added successfully",
                        });
                    })
                    .catch((error) => {
                        console.log("error: ", error);

                        return res.status(200).json({
                            success: false,
                            statusCode: 400,
                            message: "adding new Rating  failed"
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
    getLastPostedJobId = async (req, res) => {
        try {

            const userId = req.userId;
            const lastJob = await jobModel
                .findOne({ client_id: userId })
                .sort({ _id: -1 })
                .limit(1);

            if (lastJob) {
                res.status(200).json({ data: lastJob._id });

            } else {
                return res.status(404).json({ success: false, message: 'No job found for this user.' });
            }
        } catch (error) {
            console.error('Error fetching last posted job:', error);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },


    clientProfile = async (req, res) => {
        try {
            const { clientId } = req.params;


            const user = await userModel.findById(clientId).select('-password');
            if (!user || user.role !== 'client') {
                return res.status(404).json({ message: 'client not found' });
            }
            const clientProfile = await clientProfileModel.findOne({ user_id: user._id });

            console.log("Received client:", clientProfile);
            if (!clientProfile) {
                return res.status(404).json({ message: 'client profile not found' });
            }
            const clientData = {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                email: user.email,
                country: user.country,
                image: user.image,
                website: clientProfile.website,
                bio: clientProfile.bio
            };

            return res.status(200).json({
                success: true,
                data: clientData
            });

        } catch (error) {
            console.error('Error fetching  profile:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    },
    jobProfile = async (req, res) => {
        try {
            const { jobId } = req.params;
           // console.log(jobId);

            const job = await jobModel.findById(jobId);
         
            if (!job) {
                return res.status(404).json({ message: 'job not found' });
            }
            const jobData = {
                id: job._id,
                job_title: job.job_title,
                description: job.description,
                budget: job.budget,
                skills_required: job.skills_required,
                deadline: job.deadline,
                created : job.createdAt


            };
            //console.log('data fecthing:', jobData);
            return res.status(200).json({
                success: true,
                data: jobData


            });

        } catch (error) {
            console.error('Error fetching  profile:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    },


    sendMessage = async (req, res) => {
        try {
            const senderId = req.user_id;
            const { receiverId, message } = req.body;

            if (!receiverId || !message) {
                return res.status(400).json({ success: false, message: "Receiver and message are required" });
            }

            const newMessage = new messageModel({
                senderId,
                receiverId,
                message,
            });

            await newMessage.save();

            res.status(201).json({
                success: true,
                message: "Message sent successfully",
                data: newMessage,
            });

        } catch (err) {
            console.error("Send Message Error:", err);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    },
    getMessages = async (req, res) => {
        try {
            const userId = req.userId;
            const messages = await messageModel.find({ receiverId: userId })
                .populate('senderId', 'name')
                .sort({ timestamp: -1 });

            res.status(200).json({
                success: true,
                data: messages,
            });
        } catch (err) {
            console.error('Error fetching messages:', err);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },

    viewClient = async (req, res) => {
        try {
            const allClient = await userModel.find({ role: 'client' });

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "all Client retrieved successfully",
                count: allClient.length,
                data: allClient
            });
        } catch (err) {
            console.log("errro:", err);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Failed to fetch client"
            })
        }
    },
    myProposals = async (req, res) => {
        try {
          const {clientId}  = req.params;
          const proposals = await bidModel.find({ client_id: clientId })
            .populate('job_id', 'job_title')
            .populate('freelancer_id', 'name');
      
          const formattedProposals = proposals.map((proposal) => ({
            _id: proposal._id,
            title: proposal.job_id.job_title,
            bidAmount: proposal.bid_amount,
            status: proposal.status,
            freelancerName: proposal.freelancer_id.name,
          }));
      
          res.status(200).json({
            success: true,
            data: formattedProposals,
          });
        } catch (err) {
          console.error('Error fetching proposals:', err);
          res.status(500).json({ success: false, message: 'Server Error' });
        }
      };
      

    acceptBid = async (req, res) => {
        const { bidId, amount } = req.params;
        const { clientId } = req.body;

        try {
            const bid = await Bid.findById(bidId).populate('projectId freelancerId');

            if (!bid) {
                return res.status(404).json({ message: 'Bid not found' });
            }


            const project = await Project.findById(bid.projectId);
            if (project.clientId.toString() !== clientId) {
                return res.status(403).json({ message: 'You are not authorized to accept this bid' });
            }

            const amount = bid.amount * 0.5;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'usd',
                payment_method_types: ['card'],
            });


            bid.status = 'accepted';
            await bid.save();


            let freelancerWallet = await Wallet.findOne({ userId: bid.freelancerId });
            if (!freelancerWallet) {
                freelancerWallet = new Wallet({ userId: bid.freelancerId });
            }
            freelancerWallet.balance += amount;
            await freelancerWallet.save();


            res.status(200).json({
                message: 'Bid accepted successfully!',
                paymentIntent: paymentIntent.client_secret,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error, please try again later' });
        }
    },

    getBidDetails = async (req, res) => {
        try {
            const { bidId } = req.params;
            const bid = await bidModel
                .findById(bidId)
                .populate('freelancer_id', 'name email image')
                .populate('client_id', 'name email')
                .populate('job_id', 'job_title description budget');


            if (bid.bid_amount) {
                bid.bid_amount = bid.bid_amount?.toString();
            }
            if (bid.budget) {
                bid.budget = bid.budget?.toString();
            }

            if (!bid) {
                return res.status(404).json({
                    success: false,
                    message: 'Bid not found',
                });
            }


            return res.status(200).json({
                success: true,
                data: bid,
            });

        } catch (err) {
            console.error('Error fetching bid details:', err);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: err.message,
            });
        }
    },
    getUsers = async (req, res) => {
        const { receiverId } = req.params;
      
        const user = await userModel.findById(receiverId).select("_id name");
        if (!user) return res.status(404).json({ message: "User not found" });
      
        res.json({ data: user });
      };



    module.exports = {
        getUsers,
        deleteJob,
        updateJob,
        clientProfile,
        jobProfile,
        getBidDetails,
        addReview,
        acceptBid,
        sendMessage,
        getMessages,
        getLastPostedJobId,
        viewClient,
        viewJob,
        myProposals
    };