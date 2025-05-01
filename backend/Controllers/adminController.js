const userModel = require('../Models/userModel');
const jobModel = require('../Models/jobModel');
const reviewModel = require('../Models/reviewModel');

 
 deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("api call: ", userId);

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
},


listJobs =  async (req, res) => {
    try {
        const allJobs = await jobModel.find({ isDeleted: false });

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
            console.error("Error while deleting job:", e);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: `Internal Server Error: ${e.message}`
            });
        }
    },
   

    viewReview = async (req, res) => {
  try {
    const allReviews = await reviewModel.find();

    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        count: allReviews.length,
        data: allReviews
    });
} catch (err) {
    return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch review"
    })
}
},
Clients = async (req, res) => {
            try {
                const allClient = await userModel.find({role: 'client'});
    
                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: "all Client retrieved successfully",
                    count: allClient.length,
                    data: allClient
                });
            } catch (err) {
                console.log("errro:",err);
                return res.status(500).json({
                    success: false,
                    statusCode: 500,
                    message: "Failed to fetch client"
                })
            }
        },
        viewClient = async (req, res) => {
                    try {
                        const allClient = await userModel.find({role: 'client'});
            
                        return res.status(200).json({
                            success: true,
                            statusCode: 200,
                            message: "all Client retrieved successfully",
                            count: allClient.length,
                            data: allClient
                        });
                    } catch (err) {
                        console.log("errro:",err);
                        return res.status(500).json({
                            success: false,
                            statusCode: 500,
                            message: "Failed to fetch client"
                        })
                    }
                },
                myProposals = async (req, res) => {
                    try {
                      const userId = req.userId; 
                      const proposals = await Proposal.find({ client_id: userId }).populate('job_id freelancer_id', 'name job_title status');
                  
                      res.status(200).json({
                         success: true,
                         data: proposals 
                        });
                    } catch (err) {
                      console.error('Error fetching proposals:', err);
                      res.status(500).json({ success: false, message: 'Server Error' });
                    }
                  },
        
        userReport =  async (req, res) => {
            const { search} = req.query;
            try {
              let filter = {};
              if (search) {
                filter = {
                  $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                  ]
                };
              }          
              const clients = await userModel.find(filter);
              res.json(clients);
            } catch (error) {
              console.log('Error fetching clients:', error);
              res.status(500).send('Error fetching clients');
            }
          },


        jobReport = async (req, res) => {
            try {
                const query = status ? { status } : {};

                const jobs = await Job.find(query)
                .populate('client_id', 'name email phone country role ') 
                .sort({ updatedAt: -1 });
          
              const reportData = jobs.map(job => ({
                title: job.job_title,
                clientName: job.client_id?.name,
                clientEmail: job.client_id?.email,
                budget: job.budget.toString(),
                deadline: job.deadline,
                completedAt: job.updatedAt,
              }));
          
              res.status(200).json(reportData);
            } catch (error) {
              console.error("Error fetching job reports:", error);
              res.status(500).json({ message: 'Server error' });
            }
          };
          


module.exports = {
   
  deleteUser,
  viewClient,
  deleteJob,
  viewReview,
  userReport,
  jobReport
};
