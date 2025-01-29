import { APP_ROUTES } from '@core';
import {
	AccountScreen,
	AuthorizationScreen,
	AUTH_ROUTES,
	CodeConfirmPage,
	CompanyRegistrationPage,
	DESIGNING_ROUTES,
	DevScreen,
	GuidbooksLauout,
	GUIDBOOKS_ROUTES,
	HomeScreen,
	LandingScreen,
	LoginPage,
	MainScreen,
	MaterialsPage,
	NotFoundScreen,
	USERS_LIST_ROUTES,
} from '@features';
import { Route, Routes } from 'react-router-dom';

export const AppRouter = () => {
	return (
		<Routes>
			<Route path={APP_ROUTES.landing.route} element={<LandingScreen />} />
			<Route path={APP_ROUTES.auth.route} element={<AuthorizationScreen />}>
				<Route path={AUTH_ROUTES.login.route} element={<LoginPage />} />
				<Route path={AUTH_ROUTES.code_approve.route} element={<CodeConfirmPage />} />
				<Route
					path={AUTH_ROUTES.company_registration.route}
					element={<CompanyRegistrationPage />}
				/>
			</Route>
			<Route path={APP_ROUTES.designing.route} element={<HomeScreen />}>
				<Route path={DESIGNING_ROUTES.main.route} element={<MainScreen />} />
				<Route
					path={DESIGNING_ROUTES.constructor.route}
					element={<DevScreen title="Конструктор" />}
				/>
				<Route path={DESIGNING_ROUTES.account.route} element={<AccountScreen />} />
				<Route
					path={DESIGNING_ROUTES.accounts.route}
					element={<DevScreen title="Счета" />}
				/>
				<Route
					path={DESIGNING_ROUTES.subscribes_constructor.route}
					element={<DevScreen title="Конструктор подписок" />}
				/>
				<Route path={DESIGNING_ROUTES.news.route} element={<DevScreen title="Новости" />} />
				<Route
					path={DESIGNING_ROUTES.reports.route}
					element={<DevScreen title="Отчеты" />}
				/>
				<Route path={DESIGNING_ROUTES.guidbooks.route} element={<GuidbooksLauout />}>
					<Route path={GUIDBOOKS_ROUTES.materials.route} element={<MaterialsPage />} />
					<Route
						path={GUIDBOOKS_ROUTES.constructions.route}
						element={<DevScreen title="Конструкции" />}
					/>
					<Route
						path={GUIDBOOKS_ROUTES.requirements.route}
						element={<DevScreen title="Требования" />}
					/>
					<Route
						path={GUIDBOOKS_ROUTES.issuers.route}
						element={<DevScreen title="Производители" />}
					/>
				</Route>
				<Route
					path={DESIGNING_ROUTES.users_list.route}
					element={<div className="flex grow"></div>}
				>
					<Route
						path={USERS_LIST_ROUTES.client.route}
						element={<DevScreen title="Клиент" />}
					/>
					<Route
						path={USERS_LIST_ROUTES.manager.route}
						element={<DevScreen title="Менеджер" />}
					/>
				</Route>
			</Route>
			<Route path="*" element={<NotFoundScreen />} />
		</Routes>
	);
};
