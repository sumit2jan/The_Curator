const mongoose = require("mongoose");
const UserDetail = require("../models/userDetail");
const User = require("../models/userModel");
const uploadMedia = require("../utils/uploadMedia");
const cloudinary = require("../config/cloudinary");

// DashBoard
const getAllUsers = async (req, res) => {
    try {
        let page = Math.max(parseInt(req.query.page) || 1, 1);
        let limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

        const search = req.query.search?.trim() || "";
        const gender = req.query.gender || "";
        const country = req.query.country || "";
        const isVerified = req.query.isVerified;

        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        const baseMatch = {
            role: "user",
        };

        if (isVerified !== undefined) {
            baseMatch.isVerified = isVerified === "true";
        }

        const allowedSortFields = ["createdAt", "email", "username"];
        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const pipeline = [
            { $match: baseMatch },

            {
                $lookup: {
                    from: "userdetails",
                    localField: "_id",
                    foreignField: "userId",
                    as: "detail",
                },
            },
            {
                $unwind: {
                    path: "$detail",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // SEARCH
            ...(search
                ? [
                    {
                        $match: {
                            $or: [
                                { email: { $regex: search, $options: "i" } },
                                { username: { $regex: search, $options: "i" } },
                                { "detail.firstName": { $regex: search, $options: "i" } },
                                { "detail.lastName": { $regex: search, $options: "i" } },
                            ],
                        },
                    },
                ]
                : []),

            // FILTERS
            ...(gender ? [{ $match: { "detail.gender": gender } }] : []),
            ...(country ? [{ $match: { "detail.country": country } }] : []),

            {
                $facet: {
                    data: [
                        { $sort: { [sortField]: order } },

                        {
                            $project: {
                                _id: 1,
                                email: 1,
                                username: 1,
                                isVerified: 1,
                                profileVisibility: 1,
                                createdAt: 1,

                                firstName: "$detail.firstName",
                                lastName: "$detail.lastName",
                                gender: "$detail.gender",
                                country: "$detail.country",
                                bio: "$detail.bio",
                                profilePic: "$detail.profilePic",
                                cover: "$detail.cover",
                                dob: "$detail.dob",
                            },
                        },

                        { $skip: skip },
                        { $limit: limit },
                    ],

                    totalCount: [{ $count: "total" }],
                },
            },
        ];

        const result = await User.aggregate(pipeline);

        const users = result[0].data;
        const totalUsers = result[0].totalCount[0]?.total || 0;

        return res.status(200).json({
            success: true,
            message: users.length ? "Users fetched" : "No users found",
            data: users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                limit,
            },
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};
// const getAllUsers = async (req, res) => {
//     try {
//         let page = Math.max(parseInt(req.query.page) || 1, 1);
//         let limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

//         const search = req.query.search?.trim() || "";
//         const gender = req.query.gender || "";
//         const country = req.query.country || "";

//         const sortBy = req.query.sortBy || "createdAt";
//         const order = req.query.order === "asc" ? 1 : -1; // ascending or decending in order  

//         const skip = (page - 1) * limit;

//         const baseMatch = {
//             role: "user",
//         };

//         const pipeline = [
//             { $match: baseMatch },

//             {
//                 $lookup: {
//                     from: "userdetails", // ✅ fixed
//                     localField: "_id",
//                     foreignField: "userId",
//                     as: "detail",
//                 },
//             },
//             {
//                 $unwind: {
//                     path: "$detail",
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//         ];

//         // SEARCH 
//         if (search) {
//             pipeline.push({
//                 $match: {
//                     $or: [
//                         { email: { $regex: search, $options: "i" } },
//                         { username: { $regex: search, $options: "i" } },
//                         { "detail.firstName": { $regex: search, $options: "i" } },
//                         { "detail.lastName": { $regex: search, $options: "i" } },
//                     ],
//                 },
//             });
//         }

//         // FILTER
//         if (gender) {
//             pipeline.push({ $match: { "detail.gender": gender } });
//         }

//         if (country) {
//             pipeline.push({ $match: { "detail.country": country } });
//         }

//         // SORT
//         const allowedSortFields = ["createdAt", "email", "username"];
//         const sortField = allowedSortFields.includes(sortBy)
//             ? sortBy
//             : "createdAt";

//         pipeline.push({
//             $sort: { [sortField]: order },
//         });

//         // PROJECT 
//         pipeline.push({
//             $project: {
//                 _id: 1,
//                 email: 1,
//                 username: 1,
//                 isVerified: 1,
//                 createdAt: 1,

//                 firstName: "$detail.firstName",
//                 lastName: "$detail.lastName",
//                 gender: "$detail.gender",
//                 country: "$detail.country",
//                 bio: "$detail.bio",
//                 profilePic: "$detail.profilePic",
//                 dob: "$detail.dob",
//             },
//         });

//         // PAGINATION 
//         pipeline.push({ $skip: skip });
//         pipeline.push({ $limit: limit });

//         const users = await User.aggregate(pipeline);

//         // TOTAL COUNT 
//         const totalPipeline = [
//             { $match: baseMatch },

//             {
//                 $lookup: {
//                     from: "userdetails",
//                     localField: "_id",
//                     foreignField: "userId",
//                     as: "detail",
//                 },
//             },
//             {
//                 $unwind: {
//                     path: "$detail",
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//         ];

//         if (search) {
//             totalPipeline.push({
//                 $match: {
//                     $or: [
//                         { email: { $regex: search, $options: "i" } },
//                         { username: { $regex: search, $options: "i" } },
//                         { "detail.firstName": { $regex: search, $options: "i" } },
//                         { "detail.lastName": { $regex: search, $options: "i" } },
//                     ],
//                 },
//             });
//         }

//         if (gender) {
//             totalPipeline.push({ $match: { "detail.gender": gender } });
//         }

//         if (country) {
//             totalPipeline.push({ $match: { "detail.country": country } });
//         }

//         totalPipeline.push({ $count: "total" });

//         const totalResult = await User.aggregate(totalPipeline);
//         const totalUsers = totalResult[0]?.total || 0;

//         // RESPONSE  
//         return res.status(200).json({
//             success: true,
//             message: users.length ? "Users fetched" : "No users found",
//             data: users,
//             pagination: {
//                 currentPage: page,
//                 totalPages: Math.ceil(totalUsers / limit),
//                 totalUsers,
//                 limit,
//             },
//         });
//     } catch (error) {
//         console.error("Dashboard Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching users",
//             error: error.message,
//         });
//     }
// };

// update
const updateUser = async (req, res) => {
    // console.log("HEADERS:", req.headers);
    // console.log("BODY:", req.body);
    try {
        const userId = req.params.id;
        const loggedInId = req.user._id.toString();

        // Authorization
        if (req.user.role !== "admin" && userId !== loggedInId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: null
            });
        }

        //  Check user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // Get existing detail
        const existingDetail = await UserDetail.findOne({ userId });

        //  Extract body
        const {
            email,
            username,
            isVerified,
            profileVisibility,
            firstName,
            lastName,
            gender,
            country,
            bio,
            dob
        } = req.body;

        //  Prepare update objects
        let userUpdate = {};
        let detailUpdate = {};

        if (email !== undefined && email !== "") {
            const existingEmail = await User.findOne({
                email,
                _id: { $ne: userId }
            });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists",
                    data: null
                });
            }

            userUpdate.email = email;
        }

        if (username !== undefined && username !== "") {
            const existingUsername = await User.findOne({
                username,
                _id: { $ne: userId }
            });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists",
                    data: null
                });
            }
            userUpdate.username = username;
        }


        //  Only admin can change isVerified
        if (req.user.role === "admin" && isVerified !== undefined) {
            userUpdate.isVerified = isVerified;
        }

        // for user profile visibility
        if (profileVisibility !== undefined) {
            userUpdate.profileVisibility = profileVisibility;
        }

        if (firstName !== undefined) detailUpdate.firstName = firstName;
        if (lastName !== undefined) detailUpdate.lastName = lastName;
        if (gender !== undefined) detailUpdate.gender = gender;
        if (country !== undefined) detailUpdate.country = country;
        if (bio !== undefined) detailUpdate.bio = bio;
        if (dob !== undefined) detailUpdate.dob = dob;



        // check if the fields are upadted or not 
        if (
            Object.keys(userUpdate).length === 0 &&
            Object.keys(detailUpdate).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "No data provided to update",
                data: null
            });
        }

        //  Update User
        let updatedUser = user;
        if (Object.keys(userUpdate).length > 0) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                userUpdate,
                { new: true, runValidators: true, context: "query" }
            );
        }

        //  Update UserDetail
        let updatedDetail = existingDetail;
        if (Object.keys(detailUpdate).length > 0) {
            updatedDetail = await UserDetail.findOneAndUpdate(
                { userId },
                detailUpdate,
                { new: true, upsert: true, runValidators: true }
            );
        }

        //  Response
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                user: updatedUser,
                detail: updatedDetail
            }
        });

    } catch (error) {
        console.error("Update Error:", error);

        // Validation Error
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message
        });
    }
};

// delete 
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const loggedInId = req.user._id.toString();

        console.log(userId);
        // Only admin allowed
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: null
            });
        }

        // Admin cannot delete himself
        if (userId === loggedInId) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot delete himself",
                data: null
            });
        }

        // Check user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // Delete user + details
        await User.findByIdAndDelete(userId);
        await UserDetail.findOneAndDelete({ userId });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null
        });

    } catch (error) {
        console.error("Delete Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message,
            data: null
        });
    }
};

// toggle 
const toggleVerify = async (req, res) => {
    try {
        const userId = req.params.id;

        // Only admin allowed
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: null
            });
        }

        // Check user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // Toggle logic
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isVerified: !user.isVerified },
            { returnDocument: "after" } // new alternative
        );

        return res.status(200).json({
            success: true,
            message: `User is now ${updatedUser.isVerified ? "verified" : "unverified"}`,
            data: updatedUser
        });

    } catch (error) {
        console.error("Toggle Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating verification",
            error: error.message
        });
    }
};

//profile 
const getUserProfile = async (req, res) => {
    try {

        const paramId = req.params.id;
        const loggedInUser = req.user;
        const loggedInId = loggedInUser._id.toString();

        let targetUserId = paramId || loggedInId;

        // STEP 1: GET TARGET USER VISIBILITY
        const targetUser = await User.findById(targetUserId)
            .select("profileVisibility followers");

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // STEP 2: AUTHORIZATION CHECK
        const isOwner = targetUserId === loggedInId;
        const isAdmin = loggedInUser.role === "admin";
        const isPublic = targetUser.profileVisibility === "public";

        if (!isPublic && !isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "This profile is private",
                data: null
            });
        }

        // STEP 3: CHECK FOLLOW STATUS
        const isFollowing = targetUser.followers.some(
            (id) => id.toString() === loggedInId
        );

        // STEP 4: AGGREGATION
        const userId = new mongoose.Types.ObjectId(targetUserId);

        const result = await User.aggregate([
            {
                $match: { _id: userId }
            },

            {
                $lookup: {
                    from: "userdetails",
                    localField: "_id",
                    foreignField: "userId",
                    as: "details"
                }
            },

            {
                $unwind: {
                    path: "$details",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    password: 0,
                    __v: 0,
                    refreshTokens: 0,
                    googleId: 0,

                    "details.__v": 0,
                    "details.userId": 0
                }
            },

            {
                $addFields: {
                    firstName: "$details.firstName",
                    lastName: "$details.lastName",
                    gender: "$details.gender",
                    country: "$details.country",
                    bio: "$details.bio",
                    dob: "$details.dob",
                    profilePic: "$details.profilePic",
                    cover: "$details.cover",
                    detailId: "$details._id"
                }
            },

            {
                $project: {
                    details: 0
                }
            }
        ]);

        if (!result.length) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // ADD EXTRA FRONTEND FIELDS
        result[0].isFollowing = isFollowing;

        result[0].isOwner = isOwner;


        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: result[0]
        });

    } catch (error) {

        console.log("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            data: null
        });
    }
};
// const getUserProfile = async (req, res) => {
//     try {
//         const paramId = req.params.id;
//         const loggedInUser = req.user;
//         const loggedInId = loggedInUser._id.toString();

//         let targetUserId = paramId || loggedInId;

//         // STEP 1: Get target user's visibility
//         const targetUser = await User.findById(targetUserId).select("profileVisibility");

//         if (!targetUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//                 data: null
//             });
//         }

//         // STEP 2: Authorization check
//         const isOwner = targetUserId === loggedInId;
//         const isAdmin = loggedInUser.role === "admin";
//         const isPublic = targetUser.profileVisibility === "public";

//         if (!isPublic && !isOwner && !isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message: "This profile is private",
//                 data: null
//             });
//         }

//         // STEP 3: Aggregation
//         const userId = new mongoose.Types.ObjectId(targetUserId);

//         const result = await User.aggregate([
//             {
//                 $match: { _id: userId }
//             },
//             {
//                 $lookup: {
//                     from: "userdetails",
//                     localField: "_id",
//                     foreignField: "userId",
//                     as: "details"
//                 }
//             },
//             {
//                 $unwind: {
//                     path: "$details",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $project: {
//                     password: 0,
//                     __v: 0,
//                     "details.__v": 0,
//                     "details.userId": 0
//                 }
//             },
//             {
//                 $addFields: {
//                     firstName: "$details.firstName",
//                     lastName: "$details.lastName",
//                     gender: "$details.gender",
//                     country: "$details.country",
//                     bio: "$details.bio",
//                     dob: "$details.dob",
//                     profilePic: "$details.profilePic",
//                     cover: "$details.cover",
//                     detailId: "$details._id"
//                 }
//             },
//             {
//                 $project: {
//                     details: 0
//                 }
//             }
//         ]);

//         if (!result.length) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//                 data: null
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Profile fetched successfully",
//             data: result[0]
//         });

//     } catch (error) {
//         console.log("Get Profile Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//             data: null
//         });
//     }
// };

// profile pic update krne ke liye 
const uploadProfilePic = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file;
        console.log(" req.file;")
        // No file
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
                data: null
            });
        }

        // Step 1: Get existing user
        const userDetail = await UserDetail.findOne({ userId });

        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        const oldPublicId = userDetail.profilePic?.public_id;

        // Step 2: Upload new image
        const uploaded = await uploadMedia([file], "profile");
        const image = uploaded[0]; // { url, public_id }

        // Step 3: Update DB (FIXED)
        const updatedUser = await UserDetail.findOneAndUpdate(
            { userId },
            {
                profilePic: {
                    url: image.url,
                    public_id: image.public_id,
                },
            },
            { returnDocument: "after" } // ✅ new: true ka replacement
        );

        // Step 4: Delete old image (SAFE)
        if (oldPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
                console.log("Old image deleted:", oldPublicId);
            } catch (err) {
                console.log("Failed to delete old image:", err.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: updatedUser,
        });

    } catch (error) {
        console.error("Profile upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload profile picture",
            data: null
        });
    }
};
// cover pic update krne ke liye
const uploadCoverPic = async (req, res) => { // upload cover ke liye 
    try {
        const userId = req.user.id;
        const file = req.file;

        // No file
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Step 1: Get existing user
        const userDetail = await UserDetail.findOne({ userId });

        if (!userDetail) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!userDetail) {
            userDetail = await UserDetail.create({ userId });
        }

        const oldPublicId = userDetail.cover?.public_id;

        // Step 2: Upload new cover image
        const uploaded = await uploadMedia([file], "profileCover");
        const image = uploaded[0]; // { url, public_id }

        // Step 3: Update DB
        const updatedUser = await UserDetail.findOneAndUpdate(
            { userId },
            {
                cover: {
                    url: image.url,
                    public_id: image.public_id,
                },
            },
            { returnDocument: "after" }
        );

        // Step 4: Delete old cover (SAFE)
        if (oldPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
                console.log("Old cover deleted:", oldPublicId);
            } catch (err) {
                console.log("Failed to delete old cover:", err.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Cover image updated successfully",
            data: updatedUser,
        });

    } catch (error) {
        console.error("Cover upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload cover image",
        });
    }
};

// follow and unfollow
const toggleFollow = async (req, res) => {
    try {

        const targetUserId = req.params.userId;
        const loggedInUserId = req.user._id;

        // VALIDATE USER ID
        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
                data: null
            });
        }

        // PREVENT SELF FOLLOW

        if (targetUserId === loggedInUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
                data: null
            });
        }

        // FIND USERS

        const targetUser = await User.findById(targetUserId);

        const loggedInUser = await User.findById(loggedInUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // CHECK ALREADY FOLLOWING

        const alreadyFollowing = loggedInUser.following.some(
            (id) => id.toString() === targetUserId
        );

        // UNFOLLOW USER

        if (alreadyFollowing) {

            // REMOVE FROM FOLLOWING
            loggedInUser.following.pull(targetUserId);

            // REMOVE FROM FOLLOWERS
            targetUser.followers.pull(loggedInUserId);

            // DECREMENT COUNTS
            loggedInUser.followingCount -= 1;
            targetUser.followersCount -= 1;

            // SAVE BOTH USERS
            await loggedInUser.save();
            await targetUser.save();

            return res.status(200).json({
                success: true,
                message: "User unfollowed successfully",
                data: {
                    following: false,
                    followersCount: targetUser.followersCount
                }
            });
        }

        // FOLLOW USER

        // ADD TO FOLLOWING
        loggedInUser.following.push(targetUserId);

        // ADD TO FOLLOWERS
        targetUser.followers.push(loggedInUserId);

        // INCREMENT COUNTS
        loggedInUser.followingCount += 1;
        targetUser.followersCount += 1;

        // SAVE BOTH USERS
        await loggedInUser.save();
        await targetUser.save();

        return res.status(200).json({
            success: true,
            message: "User followed successfully",
            data: {
                following: true,
                followersCount: targetUser.followersCount
            }
        });

    } catch (error) {

        console.log("Toggle Follow Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            data: null
        });
    }
};


module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    toggleVerify,
    getUserProfile,
    uploadProfilePic,
    uploadCoverPic,
    toggleFollow
};