type StartViewTransitionFunc = () => void;
type StartViewTransitionReturn = {
    updateCallbackDone: Promise<void>;
    ready: Promise<void>;
    finished: Promise<void>;
}
declare type StartViewTransition = (func: StartViewTransitionFunc) => StartViewTransitionReturn;
declare interface Document {
    startViewTransition?: StartViewTransition;
}