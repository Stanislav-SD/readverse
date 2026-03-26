declare module 'graphql-depth-limit' {
    type DepthLimit = (depth: number, options?: { ignore?: string[] }) => any;
    const graphqlDepthLimit: DepthLimit;
    export default graphqlDepthLimit;
  }