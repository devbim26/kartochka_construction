import { Component } from '@features';
import { Route, Routes } from 'react-router-dom';

export const AppRouter = () => {
	return <Routes>
		<Route path='/' element={<Component/>}></Route>
	</Routes>;
};
