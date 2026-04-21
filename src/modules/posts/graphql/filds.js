import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import * as resolve from "./resolve.js";
import * as type from "./type.js";
export const getPostFields = {
    getOnePost: {
        type: type.PostType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: resolve.getPostsResolve,
    },
    getAllPosts: {
        type: type.PostsType,
        resolve: resolve.getAllPostsResolve,
    }
}

export const postMutationFields = {
    likePost : {
        type: type.likePostType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: resolve.likePostResolve,
    }
}