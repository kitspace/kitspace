import * as React from 'react';
export declare class Document extends React.Component<any, any> {
    static getInitialProps({ assets, data, renderPage }: any): Promise<any>;
    render(): JSX.Element;
}
export declare function AfterRoot(): JSX.Element;
export declare function AfterData({ data }: any): JSX.Element;
