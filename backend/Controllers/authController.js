const userModel = require("../Models/userModel");
const freelancerProfileModel = require("../Models/freelancerProfileModel");
const clientProfileModel = require("../Models/clientProfileModel");
const wallet = require("../Models/walletModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');


userRegistration = async (req, res) => {
    try {
        const { name,username,email,password,phoneno,country,role } = req.body;
        const image = req.file ? req.file.filename : null;
        console.log("image:", req.file);
        const phone = Number(req.body.phoneno); 

        if (name && username && email && password && phone && country && role) {
            const encryptedPassword = await bcrypt.hash(password, 10);

            const newUser = new userModel({
                name,
                username,
                email,
                password: encryptedPassword,
                phone,
                country,
                role,
                image
            });
            newUser.save()
                .then(async (response) => {
                    console.log("User created: ", response);
                    await wallet.create({
                        user_id: response._id,
                        balance: 0,
                        pending: 0,
                        amount : 0,
                        transactions: []
                    });


                    if (role === 'freelancer') {
                        const {portfolio_links,skills,bio } = req.body;
                        const hourly_rate = Number(req.body.hourly_rate); // or parseInt(req.body.hourly_rate)
                        const experience = Number(req.body.experience);
                        await freelancerProfileModel.create({
                            user_id: response._id,
                            portfolio_links,
                            hourly_rate,
                            experience,
                            skills: skills.split(',').map(skill => skill.trim()),
                            bio: bio 
                        });
                    } else if (role === 'client') {
                        const {company_name,website,bio } = req.body;
                        await clientProfileModel.create({
                            user_id: response._id,
                            company_name,
                            website,
                            bio
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        statusCode: 201,
                        message: "User and profile added successfully",
                    });
                })
                .catch((error) => {
                    console.log("User creation error:", error);


                    if (error?.code === 11000) {
                        return res.status(200).json({
                            success: false,
                            statusCode: 400,
                            message: "User with same name already exists!"
                        });
                    } else {
                        return res.status(500).json({
                            success: false,
                            statusCode: 500,
                            message: "User adding failed",
                            error: error.message || error,
                        });
                    }
                })
        } else {
            return res.status(200).json({
                success: false,
                statusCode: 400,
                message: "Missing required fields"
            });
        }

    } catch (err) {
        console.log("error from server:",err);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Internal Server Error"
        });
    }
},

    userLogin = async (req, res) => {
        try {
            
            const { email, password } = req.body;

            if (email && password) {
                const userFound = await userModel.findOne({ email: email }).lean();
                console.log(userFound);
                if (userFound) {
                    const isPasswordMatch = await bcrypt.compare(password, userFound.password);

                    if (isPasswordMatch) {
                        delete userFound.password;
                        const jwtSecret = process.env.JWT_SECRET;
                        const token = jwt.sign(
                            {
                                userId: userFound?._id,
                                role: userFound?.role
                            },
                            jwtSecret,
                            { expiresIn: '5d' }
                        )

                        return res.status(200).json({
                            success: true,
                            statusCode: 200,
                            message: "User Login successfully",
                            token: token,
                            user: userFound
                        });
                    } else {
                        return res.status(401).json({
                            success: false,
                            statusCode: 401,
                            message: "Incorrect password!"
                        });
                    }

                } else {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: "User does not exist!"
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Missing required fields"
                });
            }

        } catch (err) {
            console.log("error: ", err);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }
module.exports = { userRegistration, userLogin };
