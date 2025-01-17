import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './core/store';
import { AppRouter } from './router';

export const App = () => {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<AppRouter />
			</Provider>
		</BrowserRouter>
	);
};
