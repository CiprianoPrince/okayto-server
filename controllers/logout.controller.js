const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;

exports.handleLogout = async (req, res) => {
    // Extract JWT token from the cookies
    const existingToken = req.cookies?.jwt;

    // If no JWT, return immediately
    if (!existingToken) return res.sendStatus(204);

    try {
        // Find user with the corresponding refreshToken
        const foundUser = await User.findOne({
            include: {
                model: RefreshToken,
                where: { token: existingToken },
            },
        });

        // If a user with the refreshToken is found, delete the token
        if (foundUser) {
            await RefreshToken.destroy({ where: { token: existingToken } });
        }

        // Clear the JWT cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('Internal Server Error');
    }
};
