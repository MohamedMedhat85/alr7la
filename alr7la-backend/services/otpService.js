const crypto = require("crypto");

module.exports = {
    async generateOtp(user) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 6 * 60 * 1000); // 5 minutes from now

        await user.update(
            { otp, otp_date: expiresAt },
            { where: { id: user.id } }
        );
        return otp;
    },

    async validateOtp(user, otp) {
        const now = new Date();

        if (now > new Date(user.otp_date)) {
            await user.update(
                { otp: null, otp_date: null },
                { where: { id: user.id } }
            );
            return { valid: false, message: "OTP expired" };
        }
        if (user.otp !== otp) {
            return { valid: false, message: "Invalid OTP" };
        }

        // Clear OTP after successful validation
        await user.update(
            { otp: null, otp_date: null },
            { where: { id: user.id } }
        );

        return { valid: true };
    }
};
