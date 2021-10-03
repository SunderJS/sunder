/**
 * This error should never ever be thrown unless there is a programming mistake by the user of Sunder.
 */
const MissingDurableObjectStateProxy = new Proxy({}, {
    get() {
        throw new Error(`The context has no \`state\` associated with it. Either you are accessing the state in a non-durable worker context, or you forgot to inject the state in the Sunder constructor. THIS IS A PROGRAMMING ERROR IN YOUR SUNDER APP.`);
}}) as DurableObjectState

/**
 * This error should never ever be thrown unless there is a programming mistake by the user of Sunder.
 */
const MissingEnvProxy = new Proxy({}, {
    get() {
        throw new Error(`The context has no \`env\` associated with it. If you are using \`Sunder.fetch\` don't forget to pass in the env. THIS IS A PROGRAMMING ERROR IN YOUR SUNDER APP.`);
}}) as Record<string, any>


export const MissingEnv = MissingEnvProxy;
export const MissingDurableObjectState = MissingDurableObjectStateProxy;