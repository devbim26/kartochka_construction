import { APP_ROUTES } from '@core';
import {
	AboutBuildingSreen,
	AccountScreen,
	AuthorizationScreen,
	CodeConfirmPage,
	CompanyRegistrationPage,
	ConstructionPickScreen,
	ConstructionsScreen,
	ConstructorLayout,
	CONSTRUCTOR_ROUTES,
	DesigningScreen,
	DevScreen,
	FloorPlansScreen,
	GuidbooksLauout,
	HomeScreen,
	IFCModelScreen,
	IssuersScreen,
	LandingScreen,
	LoginPage,
	MainScreen,
	MaterialsScreen,
	NotFoundScreen,
	ReportFormScreen,
	RequirementsScreen,
} from '@features';
import { AUTH_ROUTES } from '@features/auth/constants';
import MyConstructions from '@features/constructor/presentation/components/designing/my-costructions.component';
import { GUIDBOOKS_ROUTES } from '@features/guidbooks/constants';
import { DESIGNING_ROUTES, USERS_LIST_ROUTES } from '@features/home/constants';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to={APP_ROUTES.landing.route} replace />} />
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
				<Route path={DESIGNING_ROUTES.constructor.route} element={<ConstructorLayout />}>
					<Route
						path={CONSTRUCTOR_ROUTES.aboutBuilding.route}
						element={<AboutBuildingSreen />}
					/>
					<Route
						path={CONSTRUCTOR_ROUTES.floorPlans.route}
						element={<FloorPlansScreen />}
					/>
					<Route
						path={CONSTRUCTOR_ROUTES.constructionSelect.route}
						element={<ConstructionPickScreen />}
					/>
					<Route
						path={CONSTRUCTOR_ROUTES.designing.route}
						element={<DesigningScreen />}
					/>
					<Route
						path={CONSTRUCTOR_ROUTES.myConstructions.route}
						element={<MyConstructions />}
					/>
					<Route
						path={CONSTRUCTOR_ROUTES.reportForm.route}
						element={<ReportFormScreen />}
					/>
					<Route path={CONSTRUCTOR_ROUTES.ifcModel.route} element={<IFCModelScreen />} />
				</Route>
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
					<Route path={GUIDBOOKS_ROUTES.materials.route} element={<MaterialsScreen />} />
					<Route
						path={GUIDBOOKS_ROUTES.constructions.route}
						element={<ConstructionsScreen />}
					/>
					<Route
						path={GUIDBOOKS_ROUTES.requirements.route}
						element={<RequirementsScreen />}
					/>
					<Route path={GUIDBOOKS_ROUTES.issuers.route} element={<IssuersScreen />} />
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
