import { store } from '@core';
import { AppRouter } from '@router';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

export const App = () => {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<Helmet>
					<title>
						AI для проектирования | Звукоизоляция, нормоконтроль, визуализация —
						Беларусь и Россия
					</title>
					<meta
						name="description"
						content="AI-сервис для архитекторов и проектировщиков: расчёт звукоизоляции по СП, проверка на соответствие ТНПА Беларуси и России, генерация фасадов и анализ документов. Отчёты для экспертизы за минуты."
					/>
					<meta
						name="keywords"
						content="AI проектирование, звукоизоляция СП 02.03.01-2023, нормоконтроль Беларусь, нормоконтроль Россия, ТНПА проверка, визуализация фасадов, AI архитектура, анализ смет, техническое задание AI, строительный AI, отчёт для экспертизы, проектная документация, строительные нормы Беларусии"
					/>
				</Helmet>
				<AppRouter />
				<Toaster
					richColors
					closeButton
					toastOptions={{
						duration: 5000,
					}}
				/>
			</Provider>
		</BrowserRouter>
	);
};
