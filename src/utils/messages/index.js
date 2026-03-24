const genrateMassages = (entity) => {
    return {
        notFound: ` ${entity} not found with `,
        alreadyExists: `${entity} already exists with `,
        created: `${entity} created successfully`,
        deleted: `${entity} deleted successfully`,
        updated: `${entity} updated successfully`,
        fetch: `${entity} fetched successfully`
    }
}


export const massages = {
    user: { ...genrateMassages("user"), invalidCredentials: "invalid credentials" },
    message: genrateMassages("message"),
    auth: {
        tokenRequired: "token is required",
        invalidBearer: "invalid bearer token",
        unauthorized: "unauthorized",
        serverError: "authentication error"
    }
}