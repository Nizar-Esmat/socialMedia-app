import { GraphQLObjectType, GraphQLList, GraphQLString } from "graphql";

export const PostType = new GraphQLObjectType({
    name: "Post",
    fields: {
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) },
        video: { type: GraphQLString },
        likes: { type: new GraphQLList(GraphQLString) },
        comments: { type: new GraphQLList(GraphQLString) },
        createdBy: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    },
});

export const likePostType = new GraphQLObjectType({
    name: "LikePost",
    fields: {
        message: { type: GraphQLString },
        post: { type: PostType },
    },
});

export const PostsType = new GraphQLList(PostType);