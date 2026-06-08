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
	DesigningRequireAuth,
	DevScreen,
	FloorPlansScreen,
	GuidbooksLauout,
	IFCModelScreen,
	IssuersScreen,
	TariffPlansScreen,
	LandingContent,
	LandingScreen,
	LoginPage,
	MainScreen,
	MaterialsScreen,
	NotFoundScreen,
	SomethingWentWrongScreen,
	ReportFormScreen,
	RequirementsScreen,
	UserScreen,
	UsersLayout,
} from '@features';
import { AiVisualizationScreen } from '@features/ai-visualization/presentation/screens/ai-vizualization.screen';
import { AUTH_ROUTES } from '@features/auth/constants';
import { BillScreen } from '@features/bills';
import MyConstructions from '@features/constructor/presentation/components/designing/my-costructions.component';
import { GUIDBOOKS_ROUTES } from '@features/guidbooks/constants';
import { DESIGNING_ROUTES, USERS_LIST_ROUTES } from '@features/home/constants';
import { ArticlePage } from '@features/news/presentation/components/article-page.component';
import NewsScreen from '@features/news/presentation/screens/news.screen';
import { ActiveReportsScreen, ReportScreen } from '@features/reports';
import SubscriptionScreen from '@features/subscriptions/presentation/screens/subscription.screen';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to={APP_ROUTES.landing.route} replace />} />
			<Route path="/main" element={<Navigate to={APP_ROUTES.landing.route} replace />} />
			<Route path={APP_ROUTES.landing.route} element={<LandingScreen />}>
				<Route index element={<LandingContent />} />
			</Route>
			<Route path="/news/:articleId" element={<LandingScreen />}>
				<Route index element={<ArticlePage />} />
			</Route>
			<Route path={APP_ROUTES.error.route} element={<SomethingWentWrongScreen />} />
			<Route path={APP_ROUTES.auth.route} element={<AuthorizationScreen />}>
				<Route path={AUTH_ROUTES.login.route} element={<LoginPage />} />
				<Route path={AUTH_ROUTES.code_approve.route} element={<CodeConfirmPage />} />
				<Route
					path={AUTH_ROUTES.company_registration.route}
					element={<CompanyRegistrationPage />}
				/>
			</Route>
			<Route path={APP_ROUTES.designing.route} element={<DesigningRequireAuth />}>
				<Route
					index
					element={
						<Navigate
							to={`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`}
							replace
						/>
					}
				/>
				<Route
					path={DESIGNING_ROUTES.visualization.route}
					element={<AiVisualizationScreen />}
				/>
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
				<Route path={DESIGNING_ROUTES.accounts.route} element={<BillScreen />} />
				<Route
					path={DESIGNING_ROUTES.subscribes_constructor.route}
					element={<SubscriptionScreen />}
				/>
				<Route path={DESIGNING_ROUTES.news.route} element={<NewsScreen />} />
				<Route path={DESIGNING_ROUTES.reports.route} element={<ReportScreen />} />
				<Route
					path={DESIGNING_ROUTES.activeReports.route}
					element={<ActiveReportsScreen />}
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
					<Route
						path={GUIDBOOKS_ROUTES.tariffPlans.route}
						element={<TariffPlansScreen />}
					/>
				</Route>

				<Route path={DESIGNING_ROUTES.users_list.route} element={<UsersLayout />}>
					<Route path={USERS_LIST_ROUTES.client.route} element={<UserScreen />} />
					<Route
						path={USERS_LIST_ROUTES.manager.route}
						element={<DevScreen titleKey="sidebar.manager" />}
					/>
				</Route>
			</Route>
			<Route path="*" element={<NotFoundScreen />} />
		</Routes>
	);
};
