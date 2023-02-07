const user = require('../models/user')

exports.users = async (req,res) => {
    const data = await user.findAll()

    res.status(200).json({
        "message": "Users listed",
        "data" : data
    })
}
