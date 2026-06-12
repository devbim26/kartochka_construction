import { lazy } from 'react';

export * from './guidbook-layout.screen';

export const RequirementsScreen = lazy(() => import('./requirements.screen'));
export const MaterialsScreen = lazy(() => import('./materials.screen'));
export const IssuersScreen = lazy(() => import('./issuers.screen'));
export const ConstructionsScreen = lazy(() => import('./constructions.screen'));
export const TariffPlansScreen = lazy(() => import('./tariff-plans.screen'));
export const AcousticModelsScreen = lazy(() => import('./acoustic-models.screen'));
