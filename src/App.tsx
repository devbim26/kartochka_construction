import { store } from '@core';
import { AppRouter } from '@router';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

export const App = () => {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<AppRouter />
			</Provider>
		</BrowserRouter>
	);
};
