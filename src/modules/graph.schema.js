import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { getPostFields, postMutationFields } from "./posts/graphql/filds.js";
import { getUserFields } from "./users/graphql/filds.js";


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            ...getPostFields,
            ...getUserFields,
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            ...postMutationFields,
        },
    }),
});

export default schema