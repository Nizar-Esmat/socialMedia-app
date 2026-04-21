import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLBoolean } from "graphql";

const imageType = new GraphQLObjectType({
    name: "Image",
    fields: {
        url: { type: GraphQLString },
        alt: { type: GraphQLString },
    },
});

export const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        gender: { type: GraphQLString },
        role: { type: GraphQLString },
        isConfirmed: { type: GraphQLBoolean },
        isDeleted: { type: GraphQLBoolean },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        image: { type: imageType },
        coverImage: { type: new GraphQLList(imageType) },
    },
});

export const UsersType = new GraphQLList(UserType);
