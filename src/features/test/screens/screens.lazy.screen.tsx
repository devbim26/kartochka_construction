import { lazy, Suspense } from "react";

const LaztTestScreen = lazy(() => import('./test.screen').then(module => ({default: module.TestScreen})))

export const Component = () => {
    return <Suspense fallback={<div>Loading...</div>}>
    <LaztTestScreen/>
</Suspense>
}