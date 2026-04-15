const bcrypt = require("bcryptjs");

//  Hash function
const hashData = async (data) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(data, salt);
    } catch (error) {
        throw new Error(error.message);
    }
};

//  Compare function
const compareData = async (input, hashedData) => {
    try {
        return await bcrypt.compare(input, hashedData);
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    hashData,
    compareData,
};