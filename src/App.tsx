import faviconUrl from '@assets/favicon.svg';
import { I18nProvider, store, useI18n } from '@core';
import { FatalErrorGate, RootErrorBoundaryWithReset } from '@features/not-found';
import { AppRouter } from '@router';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

const AppShell = () => {
	const { t } = useI18n();

	return (
		<BrowserRouter>
			<Provider store={store}>
				<Helmet>
					<title>{t('meta.title')}</title>
					<meta name="description" content={t('meta.description')} />
					<meta name="keywords" content={t('meta.keywords')} />
					<link rel="icon" href={faviconUrl} type="image/svg+xml" />
					<link rel="alternate icon" href={faviconUrl} type="image/svg+xml" />
					<link rel="apple-touch-icon" href={faviconUrl} />
				</Helmet>
				<RootErrorBoundaryWithReset>
					<FatalErrorGate>
						<AppRouter />
					</FatalErrorGate>
					<Toaster
						richColors
						closeButton
						toastOptions={{
							duration: 5000,
						}}
					/>
				</RootErrorBoundaryWithReset>
			</Provider>
		</BrowserRouter>
	);
};

export const App = () => {
	return (
		<I18nProvider>
			<AppShell />
		</I18nProvider>
	);
};
