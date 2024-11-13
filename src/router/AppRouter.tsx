import { Route, Routes } from 'react-router-dom';

export const TestRouter = () => {
	return <div>Auth</div>;
};

export const AppRouter = () => {
	return (
		<Routes>
			<Route path={'/auth'} element={<TestRouter />} />
		</Routes>
	);
};
