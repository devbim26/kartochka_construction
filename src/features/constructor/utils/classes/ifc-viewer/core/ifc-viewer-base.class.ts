interface IFCViewerBaseState<T extends object> {
	inited: boolean;
	cachedInitialState: T;
}

export abstract class IFCViewerBase<T extends object, K extends object> {
	private readonly ready: Promise<void>;

	protected readonly baseState: IFCViewerBaseState<T> = {
		inited: false,
		cachedInitialState: {} as T,
	};

	protected readonly state: T = {} as T;

	constructor(props: K, initState: T) {
		this._changeBaseState(() => ({ cachedInitialState: initState }));
		this.changeState(() => ({ ...initState }));
		this.ready = this._baseInit(props);
	}

	static async create<T extends object, K extends object, C extends IFCViewerBase<T, K>>(
		cls: new (props: K, initState: T) => C,
		props: K,
		initState: T,
	): Promise<C> {
		const instance = new cls(props, initState);
		await instance.ready;
		return instance;
	}

	private _changeBaseState(
		callback: (currentState: Readonly<IFCViewerBaseState<T>>) => Partial<IFCViewerBaseState<T>>,
	) {
		Object.assign(this.baseState, callback({ ...this.baseState }));
	}

	private async _baseInit(props: K) {
		await this.init(props);
		this._changeBaseState(() => ({ inited: true }));
	}

	protected changeState(callback: (currentState: Readonly<T>) => Partial<T>) {
		Object.assign(this.state, callback({ ...this.state }));
	}

	protected baseDestroy() {
		const destroyedState = { ...this.state };

		Object.entries(this.state).forEach(([keyName, item]) => {
			if (!!item && typeof item.destroy === 'function') {
				item.destroy();
			}
			destroyedState[keyName as keyof T] =
				this.baseState.cachedInitialState[keyName as keyof T];
			if (!!item && typeof item.dispose === 'function') {
				item.dispose();
			}
			destroyedState[keyName as keyof T] =
				this.baseState.cachedInitialState[keyName as keyof T];
		});

		this._changeBaseState(() => ({
			inited: false,
			cachedInitialState: destroyedState,
		}));
		this.changeState(() => ({ ...destroyedState }));
	}

	protected abstract init(props: K): Promise<void>;

	abstract destroy(): void;
}
