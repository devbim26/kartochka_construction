import {
	Component,
	Components,
	Disposable,
	Disposer,
	Event,
	Updateable,
	UUID,
} from '@thatopen/components';
import { Mesh } from 'three';

export class HelloWorldComponent extends Component implements Disposable, Updateable {
	readonly uuid: string = UUID.create();

	enabled: boolean = true;

	private readonly _message = 'Hello';

	readonly onAfterUpdate = new Event();

	readonly onBeforeUpdate = new Event();

	readonly onDisposed = new Event();

	someMesh = new Mesh();

	constructor(components: Components) {
		super(components);
		components.add(this.uuid, this);
	}

	greet(name: string) {
		const message = `${this._message} ${name}!`;
		console.log(message);
	}

	dispose() {
		this.enabled = false;
		this.onBeforeUpdate.reset();
		this.onAfterUpdate.reset();
		const disposer = this.components.get(Disposer);
		disposer.destroy(this.someMesh);
		this.onDisposed.trigger();
		this.onDisposed.reset();
	}

	async update(delta?: number) {
		this.onBeforeUpdate.trigger();
		console.log('Updated! Delta: ' + delta);
		this.onAfterUpdate.trigger();
	}
}
