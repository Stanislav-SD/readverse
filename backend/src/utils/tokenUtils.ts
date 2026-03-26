import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../prisma/prisma';


// JWT Utility Functions

const generateToken = (payload: object, expiresIn: string = process.env.JWT_EXPIRES_IN || '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn });
};

const encryptToken = (token: string, isRefresh: boolean = false) => {
    return crypto.createHmac('sha256', isRefresh ? process.env.JWT_REFRESH_SECRET || 'default_refresh_secret' : process.env.JWT_SECRET || 'default_secret' ).update(token).digest('hex');
};

const generateRefreshToken = () => {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const encryptedRefreshToken = encryptToken(refreshToken, true);
    return { refreshToken, encryptedRefreshToken };
};

const verifyToken = (token: string, isRefresh: boolean = false) => {
    try {
        const key = isRefresh ? process.env.JWT_REFRESH_SECRET || 'default_refresh_secret' : process.env.JWT_SECRET || 'default_secret';
        return jwt.verify(token, key);
    } catch (err) {
        return false;
        /*if (err instanceof Error) {
            // Handle specific JWT errors
            if (err.name === 'TokenExpiredError') {
                throw new Error('Token has expired. Please login again.');
            } else if (err.name === 'JsonWebTokenError') {
                throw new Error('Invalid token. Please provide a valid token.');
            } else if (err.name === 'NotBeforeError') {
                throw new Error('Token is not yet active. Please check the token validity.');
            }
        }

        throw new Error('Invalid or expired token');*/
    } 
};

const generateDeviceId = (ip: string, userAgent: string ) => {
    return crypto.createHash('sha256').update(userAgent + ip).digest('hex');
};

const verifyRefreshToken = async (token: string, deviceId: string) => {
    if(!token) throw new Error('Ivalid refresh token');
    const hashedToken = encryptToken(token, true);
    const tokenData = await prisma.refreshTokens.findFirst({
        where: {
            Token: hashedToken,
            DeviceId: deviceId,
        },
    });

    if (!tokenData) {
        throw new Error('Invalid refresh token');
    }
    if (tokenData.ExpiresAt < new Date()) {
        await prisma.refreshTokens.delete({ where: { Id: tokenData.Id } });
        throw new Error('Expired refresh token');
    }

    return tokenData.UserId;
};

const invalidateRefreshToken = async (token: string, deviceId: string) => {
    if(!token) throw new Error('Ivalid refresh token');
    const hashedToken = encryptToken(token, true);
    const tokenData = await prisma.refreshTokens.findFirst({
        where: {
            Token: hashedToken,
            DeviceId: deviceId,
        },
    });

    if (!tokenData)
        throw new Error('Ivalid refresh token');
    
    await prisma.refreshTokens.delete({ where: { Id: tokenData.Id } });
};

const tokenUtils = {
    generateToken,
    generateRefreshToken,
    invalidateRefreshToken,
    encryptToken,
    verifyRefreshToken,
};

export default tokenUtils;
export { verifyToken, generateDeviceId };