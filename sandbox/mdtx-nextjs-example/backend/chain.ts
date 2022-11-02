import { Chain } from "../src/zeus";
import { scalars } from "./scalars";

export const chain = (method: 'query' | 'mutation', token: string) => {
    return Chain(process.env.NEXT_PUBLIC_HOST + '/graphql', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })(method, {
        scalars
    })
}
