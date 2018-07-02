import * as React from 'react';
export interface AsyncRouteComponentProps {
    isInitialRender: boolean;
    setAppState: (data: any) => void;
}
export interface AsyncRouteComponentState {
    Component: React.ReactNode | null;
}
/**
 * Returns a new React component, ready to be instantiated.
 * Note the closure here protecting Component, and providing a unique
 * instance of Component to the static implementation of `load`.
 */
export declare function asyncComponent<Props = any>({ loader, Placeholder, }: {
    loader: () => Promise<any>;
    Placeholder?: React.ComponentType<Props>;
}): {
    new (props: any): {
        componentWillMount(): void;
        updateState(): void;
        render(): JSX.Element | null;
        setState<K extends "Component">(state: AsyncRouteComponentState | ((prevState: Readonly<AsyncRouteComponentState>, props: Readonly<any>) => AsyncRouteComponentState | Pick<AsyncRouteComponentState, K> | null) | Pick<AsyncRouteComponentState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<any>;
        state: Readonly<AsyncRouteComponentState>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    /**
     * Static so that you can call load against an uninstantiated version of
     * this component. This should only be called one time outside of the
     * normal render path.
     */
    load(): Promise<void>;
    getInitialProps(ctx: any): any;
};
