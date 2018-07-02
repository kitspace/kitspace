import { RouteProps } from 'react-router-dom';
/**
 * This helps us to make sure all the async code is loaded before rendering.
 */
export declare function ensureReady(routes: RouteProps[], pathname?: string): Promise<any>;
