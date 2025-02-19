import { store } from '@core';
import { AppRouter } from '@router';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

export const App = () => {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<AppRouter />
				<Toaster
					richColors
					closeButton
					toastOptions={{
						duration: 8000,
					}}
				/>
			</Provider>
		</BrowserRouter>
	);
};
