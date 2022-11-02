import { Selector, InputType, GraphQLTypes, ZeusScalars } from "../../src/zeus"
import { scalars } from "../scalars"

export const userSelector = Selector('User')({
    name: true,
    email: true,
    avatarUrl: [{}, true]
})

export type UserType = InputType<GraphQLTypes['User'], typeof userSelector, typeof scalars>
