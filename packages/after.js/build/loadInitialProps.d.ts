import { RouteProps } from 'react-router-dom';
export declare function loadInitialProps(routes: RouteProps[], pathname: string, ctx: any): Promise<{
    match: any;
    data: any;
}>;
