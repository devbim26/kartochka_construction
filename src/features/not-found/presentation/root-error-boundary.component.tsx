import { APP_ROUTES } from '@core';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { SomethingWentWrongScreen } from './screens/something-went-wrong.screen';

type Props = {
	children: ReactNode;
	resetKey?: string;
};

type State = {
	hasError: boolean;
};

/**
 * Перехватывает необработанные ошибки React (рендер, lifecycle, дети)
 * и показывает экран «Что-то пошло не так» вместо красного экрана.
 */
export class RootErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('[RootErrorBoundary]', error, errorInfo.componentStack);
		if (!isOnErrorPage(window.location.pathname)) {
			window.history.replaceState(null, '', APP_ROUTES.error.route);
		}
	}

	componentDidUpdate(prevProps: Props): void {
		if (
			this.state.hasError &&
			prevProps.resetKey !== this.props.resetKey &&
			!isOnErrorPage(window.location.pathname)
		) {
			this.setState({ hasError: false });
		}
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return <SomethingWentWrongScreen />;
		}
		return this.props.children;
	}
}

function isOnErrorPage(pathname: string) {
	return pathname === APP_ROUTES.error.route;
}

/** Сбрасывает boundary при смене маршрута, чтобы можно было уйти с экрана ошибки. */
export const RootErrorBoundaryWithReset = ({ children }: { children: ReactNode }) => {
	const location = useLocation();
	return (
		<RootErrorBoundary resetKey={location.pathname}>{children}</RootErrorBoundary>
	);
};
