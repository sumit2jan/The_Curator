
const UserDetail = require("../models/userDetail");
const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        const search = req.query.search || "";
        const gender = req.query.gender || "";
        const country = req.query.country || "";

        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        let matchStage = {
            isAdmin: false
        };

        if (search) {
            matchStage.$or = [
                { firstName: { $regex: `^${search}`, $options: "i" } },
                { lastName: { $regex: `^${search}`, $options: "i" } },
                { email: { $regex: `^${search}`, $options: "i" } }
            ];
        }

        const pipeline = [
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: "userDetails",
                    localField: "_id",
                    foreignField: "userId",
                    as: "detail"
                }
            },
            {
                $unwind: {
                    path: "$detail",
                    preserveNullAndEmptyArrays: true
                }
            },
        ];

        //  Filter (after lookup because gender/country in detail)
        if (gender) {
            pipeline.push({
                $match: { "detail.gender": gender }
            });
        }

        if (country) {
            pipeline.push({
                $match: { "detail.country": country }
            });
        }

        const allowedSortFields = ["firstName", "createdAt", "email"];
        let sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

        pipeline.push({
            $sort: { [sortField]: order }
        });

        pipeline.push({
            $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                username: 1,
                isVerified: 1,
                bio: "$detail.bio",
                gender: "$detail.gender",
                country: "$detail.country",
                profilePic: "$detail.profilePic",
                dob: "$detail.dob",
                createdAt: 1
            }
        });

        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        const users = await User.aggregate(pipeline);

        // Total Count (for pagination)
        const totalPipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "userDetail",
                    localField: "_id",
                    foreignField: "userId",
                    as: "detail"
                }
            },
            {
                $unwind: {
                    path: "$detail",
                    preserveNullAndEmptyArrays: true
                }
            }
        ];

        if (gender) {
            totalPipeline.push({ $match: { "detail.gender": gender } });
        }

        if (country) {
            totalPipeline.push({ $match: { "detail.country": country } });
        }

        totalPipeline.push({ $count: "total" });

        const totalResult = await User.aggregate(totalPipeline);
        const totalUsers = totalResult[0]?.total || 0;

        // Response
        return res.status(200).json({
            success: true,
            message: users.length ? "Users fetched" : "No users found",
            data: users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers: totalUsers,
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching users",
            data: null,
            error: error.message,
        });
    }
};

module.exports = { getAllUsers };
