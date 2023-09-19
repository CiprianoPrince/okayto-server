const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;

exports.handleLogout = async (req, res) => {
    // Extract JWT token from the cookies
    const existingRefreshToken = req.cookies.jwt;

    if (!existingRefreshToken) return res.sendStatus(204);

    try {
        // Find user with the corresponding refreshToken
        const foundUser = await User.findOne({
            include: {
                model: RefreshToken,
                where: { token: existingRefreshToken },
            },
        });

        // If a user with the refreshToken is found, delete the token
        if (foundUser) {
            await RefreshToken.destroy({ where: { token: existingRefreshToken } });
        }

        // Clear the JWT cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
