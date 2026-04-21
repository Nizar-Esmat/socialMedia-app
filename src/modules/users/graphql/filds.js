import { GraphQLID, GraphQLNonNull } from "graphql";
import * as resolve from "./resolve.js";
import * as type from "./type.js";

export const getUserFields = {
    getOneUser: {
        type: type.UserType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: resolve.getOneUserResolve,
    },
    getAllUsers: {
        type: type.UsersType,
        resolve: resolve.getAllUsersResolve,
    },
};
