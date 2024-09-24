import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from '@angular/router';

/**
 * Custom implementation of RouteReuseStrategy
 */
export class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {
    /**
     * Determines if a route should be reused.
     * This strategy returns `true` when the future route config and current route config are
     * identical and alwaysRefresh parameter is set as false in routing.
     */
    override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        if (future.routeConfig === curr.routeConfig) {
            return !future.data.alwaysRefresh;
        } else {
            return false;
        }
    }
}
