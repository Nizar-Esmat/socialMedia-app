const genrateMassages = (entity) => {
    return {
        notFound: `${entity} not found`,
        alreadyExists: `${entity} already exists`,
        created: `${entity} created successfully`,
        deleted: `${entity} deleted successfully`,
        updated: `${entity} updated successfully`,
        fetch: `${entity} fetched successfully`
    }
}


export const massages = {
    user: {
        ...genrateMassages("user"),
        invalidCredentials: "invalid email or password",
        emailNotConfirmed: "please confirm your email before logging in",
        emailConfirmed: "email confirmed successfully",
        loggedIn: "logged in successfully",
        loggedOut: "logged out successfully",
        otpSent: "OTP sent to your email",
        otpInvalid: "invalid or expired OTP",
        otpNotFound: "no OTP found for this email, please request a new one",
        tokenRefreshed: "token refreshed successfully",
        passwordReset: "password reset successfully",
        emailExist: "email already in use",
        emailSame: "new email must be different from current email",
        emailUpdated: "email updated successfully",
    },
    message: genrateMassages("message"),
    auth: {
        tokenRequired: "token is required",
        invalidBearer: "invalid bearer token",
        unauthorized: "unauthorized access",
        serverError: "authentication error"
    }
}