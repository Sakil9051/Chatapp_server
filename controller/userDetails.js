const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetails(req,response){
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Authorization header missing or malformed",
                error: true
            });
        }

        const token = authHeader.split(' ')[1];

        // console.log("Token",token);
        // const token = request.cookies.token || ""
        // const token = request.body.token || ""

        const user = await getUserDetailsFromToken(token)

        return response.status(200).json({
            message : "user details",
            data : user
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = userDetails