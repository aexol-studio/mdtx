import { Selector, InputType, GraphQLTypes, ZeusScalars } from "../../src/zeus"
import { scalars } from "../scalars"

export const repositoriesSelector = Selector('RepositoryConnection')({
    nodes: {
        name: true
    }
})

export type RepositoriesType = InputType<GraphQLTypes['RepositoryConnection'], typeof repositoriesSelector, typeof scalars>
