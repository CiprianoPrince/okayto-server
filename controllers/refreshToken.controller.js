const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;
const jwt = require('jsonwebtoken');

exports.handleRefreshToken = async (req, res) => {
    // Extract JWT token from the cookies
    const existingToken = req.cookies?.jwt;
    console.log(existingToken);

    // If no JWT token is present in the cookies, return a 401 Unauthorized status
    if (!existingToken) return res.sendStatus(401);

    // Clear the JWT cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    // Fetch the user associated with the given refresh token
    const foundUser = await User.findOne({
        include: {
            model: RefreshToken,
            where: {
                token: existingToken,
            },
        },
    });

    // If the user is not found, this might indicate an attempted refresh token reuse
    if (!foundUser) {
        jwt.verify(existingToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
            // If there's an error in verifying the JWT or if the user ID doesn't match, return a 403 Forbidden status
            if (err) return res.sendStatus(403);

            // Log attempted reuse and delete the refresh token from the database
            console.log('attempted refresh token reuse!');
            await RefreshToken.destroy({ where: { userID: decoded.userID } });
        });
        return res.sendStatus(403); //Forbidden
    }

    // Delete the existing refresh token from the database
    await RefreshToken.destroy({ where: { token: existingToken } });

    // Verify the JWT with the refresh token secret
    jwt.verify(existingToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
        // If there's an error in verifying the JWT or if the user ID doesn't match, return a 403 Forbidden status
        if (err || foundUser.userID !== decoded.userID) {
            if (err) console.log('expired refresh token');
            return res.sendStatus(403);
        }

        // Create a new access token
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userID: decoded.userID,
                    role: decoded.role,
                },
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: '1d' }
        );

        // Create a new refresh token
        const refreshToken = jwt.sign(
            { userID: decoded.userID, role: decoded.role },
            process.env.REFRESH_TOKEN,
            {
                expiresIn: '1d',
            }
        );

        // Save the new refresh token in the database
        await foundUser.createRefreshToken({ token: refreshToken });

        // Set the new refresh token as a secure cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Return the new access token in the res
        res.json({ accessToken });
    });
};
