const jwt = require('jsonwebtoken');

const auth = async (requestAnimationFrame, res,next) => {
    const authHeader = requestAnimationFrame.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Authentication invalid" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        requestAnimationFrame.user = { userId: payload.userId };
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Authentication invalid" });
    }
};

module.exports = auth;
    