import express from 'express';

// TODO: OM - correct the constants here as they are mixing and does not make any sense
export type UserType = 'admin' | 'user' | 'superadmin';
export type ActionPath = 'operations' | 'stats' | 'public' | 'registration';
export type UserActionCategory = 'login' | 'signup' | 'settings' | 'dashboard' | 'datasets' | 'users';

type RoutePath = `/${UserType}`;
type RouteActionPath = `/${ActionPath}`;
type UserActionCategoryPath = `/${UserActionCategory}`;

// Function implementation
export function usePath(masterRouter: express.Router, arg2: express.Router | RoutePath | RouteActionPath, arg3?: RoutePath | RouteActionPath | UserActionCategoryPath): express.Router {
    // Case: usePath(masterRouter, '/operations')
    if (typeof arg2 === 'string') masterRouter.use(arg2, (_, __, next) => next());
    // Case: usePath(masterRouter, middleware, '/admin')
    else if (arg3) masterRouter.use(arg3, arg2);
    return masterRouter;
}