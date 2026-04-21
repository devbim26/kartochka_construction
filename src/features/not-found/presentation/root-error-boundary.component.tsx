import { Component, type ErrorInfo, type ReactNode } from 'react';
import { SomethingWentWrongScreen } from './screens/something-went-wrong.screen';

type Props = {
	children: ReactNode;
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
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return <SomethingWentWrongScreen />;
		}
		return this.props.children;
	}
}
