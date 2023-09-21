require('dotenv').config();
const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../constants');

exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;

    // Check for email and password in req body
    if (!email || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find user by email
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) return res.sendStatus(401); //Unauthorized

    // Check password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.sendStatus(401); // Unauthorized

    // Get user role
    const foundProfile = await foundUser.getProfile();
    const foundUserRole = ROLES[foundProfile.role];

    // Create JWTs
    const accessToken = jwt.sign(
        {
            userInfo: {
                userId: foundUser.userId,
                role: foundUserRole,
            },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
        { userId: foundUser.userId, role: foundUserRole },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: '1d',
        }
    );

    console.log(refreshToken);

    // Save new refresh token for the user
    await foundUser.createRefreshToken({ token: refreshToken });

    // Check for possible token reuse and handle accordingly
    if (req.cookies?.jwt) {
        const existingRefreshToken = req.cookies.jwt;
        const foundToken = await RefreshToken.findOne({ where: { token: existingRefreshToken } });

        // Detected refresh token reuse!
        if (!foundToken) {
            // clear out ALL previous refresh tokens
            RefreshToken.destroy({ where: { userId: foundUser.userId } });
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    }

    // Set cookie for refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send access token to user
    res.send({ accessToken });
};
