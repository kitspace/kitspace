import createReactContext from 'create-react-context';
var context = createReactContext({}); // TypeScript is very pedantic about re-exporting dependencies when doing
// --declaration emit, so we need to import ComponentClass. But if we don't
// explicitly use ComponentClass somewhere in the code, TypeScript *also*
// ends up issuing an error. This is dumb, but this all gets erased anyway.

var Provider = context.Provider,
    Consumer = context.Consumer;
export { Provider, Consumer };