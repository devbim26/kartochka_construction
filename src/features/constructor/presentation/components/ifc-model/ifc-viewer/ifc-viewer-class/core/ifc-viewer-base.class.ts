interface IFCViewerBaseInternalState {
	inited: boolean;
}

export abstract class IFCViewerBase<T extends object> {
	protected readonly internalState: IFCViewerBaseInternalState = {
		inited: false,
	};

	protected readonly state: T = {} as T;

	constructor(args: any, initState?: T) {
		if (!!initState) this.changeState(() => ({ ...initState }));
		this._baseInit(args);
	}

	private _changeInternalState(
		callback: (
			currentState: Readonly<IFCViewerBaseInternalState>,
		) => Partial<IFCViewerBaseInternalState>,
	) {
		const patch = callback({ ...this.internalState });
		Object.assign(this.internalState, patch);
	}

	private _baseInit(args: any) {
		if (this.internalState.inited) {
			throw new Error(
				`[${this.constructor.name}]: Initialization has already been performed`,
			);
		}
		this.init(args);
		this._changeInternalState(() => ({ inited: true }));
	}

	protected changeState(callback: (currentState: Readonly<T>) => Partial<T>) {
		const patch = callback({ ...this.state });
		Object.assign(this.state, patch);
	}

	abstract init(args: any): void;

	abstract destroy(): void;
}
