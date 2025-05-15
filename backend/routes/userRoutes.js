const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../Middlewares/auth");
const {listJobs,deleteJob,deleteUser,jobReport,clientReport,freelancerReport,paymentReport,toggleUserStatus,toggleJobStatus} = require("../Controllers/adminController");
const {addReview,viewClient,getUsers,viewJob,jobProfile,clientProfile,getBidDetails,myProposals,completedJobs} = require("../Controllers/userController");
const {getFreelancerCount,getJobCount,getOpenProjectCount} = require('../Controllers/dashboardController')
const { myProposal,viewProposals,addProposal,freelancerProfile,inviteFreelancer,bid,checkBid,freelancerBids,myBids} = require("../Controllers/freelancerController");
//const {sendMessage,unreadMessages,markAsRead,chatHistory} = require('../Controllers/messageController');
const { createPayment,initialPaymentRelease,markAsCompleted,finalPaymentRelease,finalDetails } = require('../Controllers/paymentController');
const { getWalletDetails, withdrawFunds } = require('../Controllers/walletController');


/*ADMIN ROUTES*/

router.get('/viewClient',viewClient);
router.get('/listJobs',verifyToken,checkRole('admin','freelancer'),listJobs);
router.delete('/deleteUser',verifyToken,checkRole('admin'),deleteUser);
router.delete('/deleteJob',verifyToken,checkRole(['admin', 'client']),deleteJob);
router.get('/jobReport',verifyToken,checkRole(['admin']),jobReport);
router.get('/clientReport',verifyToken,checkRole(['admin']),clientReport);
router.get('/freelancerReport',verifyToken,checkRole(['admin']),freelancerReport);
router.get('/paymentReport',verifyToken,checkRole(['admin']),paymentReport);
router.post('/toggleUserStatus',verifyToken,checkRole(['admin']),toggleUserStatus);
router.post('/toggleJobStatus',verifyToken,checkRole(['admin']),toggleJobStatus);



/*client routes*/
router.post('/addJob',verifyToken,checkRole('client'),addJob);
router.post('/addReview',verifyToken,checkRole(['client']),addReview);
router.get('/viewProposals',verifyToken,checkRole('client'),viewProposals);
router.get('/completedJobs/:freelancerId',verifyToken,checkRole('client'),completedJobs);
router.post('/getLastPostedJobId',verifyToken,checkRole('client'),getLastPostedJobId);
router.post('/inviteFreelancer',verifyToken,checkRole('client'),inviteFreelancer);
router.get('/getFreelancerCount', verifyToken,checkRole('client'), getFreelancerCount);
router.get('/getJobCount', verifyToken,checkRole('client'), getJobCount);
router.get('/getOpenProjectCount', verifyToken,checkRole('client'), getOpenProjectCount);
router.get('/getProposalCount',verifyToken,checkRole('client'),getProposalCount);
router.get('/myProposals/:clientId',verifyToken,checkRole(['client']),myProposals);
router.get('/clientProfile/:clientId',verifyToken,checkRole(['client','freelancer','admin']),clientProfile);
router.get('/acceptBid',verifyToken,checkRole(['client']),acceptBid);
router.get('/getBidDetails/:bidId',verifyToken,checkRole(['client','freelancer']),getBidDetails);
router.get('/getUsers/:receiverId', verifyToken, checkRole(['client','freelancer']), getUsers);

/*FREELANCER ROUTES*/
router.get('/getFreelancers',getFreelancers);
router.get('/getFreelancers',verifyToken,checkRole(['admin','client','freelancer']),getFreelancers);
router.get('/viewJob',verifyToken,checkRole(['client','freelancer']),viewJob);
router.get('/freelancerProfile/:freelancerId',verifyToken,checkRole(['client','freelancer']),freelancerProfile);
router.post('/bid',verifyToken,checkRole(['freelancer']),bid);
router.post('/addProposal',verifyToken,checkRole('freelancer'),addProposal);
router.get('/myProposal',verifyToken,checkRole(['client','freelancer']),myProposal);
router.get('/getMessages',verifyToken,checkRole(['client','freelancer']),getMessages);
router.get('/jobProfile/:jobId',verifyToken,checkRole(['freelancer','client']),jobProfile);
router.get('/checkBid/:freelancerId',verifyToken,checkRole(['freelancer']),checkBid);
router.get('/freelancerBids/:freelancerId', verifyToken, checkRole(['freelancer']), freelancerBids);
router.get('/myBids/:freelancerId', verifyToken, checkRole(['freelancer']), myBids);
router.get('/getWalletDetails/:freelancerId',verifyToken,checkRole(['freelancer']),getWalletDetails);
router.post('/withdrawFunds',verifyToken,checkRole(['freelancer']), withdrawFunds);

// Route to withdraw funds
/*PAYMENT ROUTES*/
router.post('/createPayment',verifyToken,checkRole(['client']),createPayment);
router.post('/initialPaymentRelease',verifyToken,checkRole(['client','freelancer']),initialPaymentRelease);
router.post('/markAsCompleted/:jobId/:freelancerId',verifyToken,checkRole(['freelancer']),markAsCompleted);
router.post('/finalPaymentRelease',verifyToken,checkRole(['client','freelancer']),finalPaymentRelease);
router.get('/finalDetails/:bidId',verifyToken,checkRole(['client']),finalDetails);

//router.post('/sendMessage',verifyToken,checkRole(['client','freelancer']), sendMessage);
//router.get('/unreadMessages/:userId',verifyToken,checkRole(['client','freelancer']), unreadMessages);
//router.put('/markAsRead',verifyToken,checkRole(['client','freelancer']), markAsRead);
//router.get('/chatHistory/:senderId/:receiverId',verifyToken,checkRole(['client','freelancer']), chatHistory);



module.exports = router;