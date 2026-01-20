import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {

    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" })
    }
    try {
        console.log('🔑 Token received:', token);
        console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET);
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded:', token_decode);
        req.body.userId = token_decode.id;
        next()
    } catch (error) {
        console.log("❌ Auth Error:", error.message);
        console.log("🔍 Error details:", error);
        res.json({ success: false, message: error.message })
    }

}

export default authMiddleware;