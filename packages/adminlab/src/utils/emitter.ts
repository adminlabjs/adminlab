type Callback = (...args: any[]) => void;

export class EventEmitter {
	private listeners: {
		[key: string]: Callback[];
	} = {};

	on(type: string, cb: Callback) {
		const listeners = this.listeners[type] || (this.listeners[type] = []);
		listeners.push(cb);
	}

	emit(type: string, ...args: any[]) {
		const listeners = this.listeners[type] || [];
		listeners.forEach((cb) => cb(...args));
	}

	removeAll() {
		this.listeners = {};
	}
}
