import { lazy } from 'react';
export * from './constructions.screen';
export * from './guidbook-layout.screen';
export * from './issuers.screen';
export * from './requirements.screen';
export const MaterialsPage = lazy(() => import('./materials.screen'));
