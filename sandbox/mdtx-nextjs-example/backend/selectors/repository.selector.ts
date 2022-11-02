import { Selector, InputType, GraphQLTypes, ZeusScalars } from "../../src/zeus"
import { scalars } from "../scalars"

export const FileSelector = Selector('Blob')({
    text: true
})

export const FolderSelector = Selector('Tree')({
    entries: {
        name: true,
        extension: true,
    }
})

export const repositorySelector = Selector('Repository')({
    object: [{ expression: "HEAD:" }, { "...on Tree": FolderSelector }]
})

export type RepositoryType = InputType<GraphQLTypes['Repository'], typeof repositorySelector, typeof scalars>
