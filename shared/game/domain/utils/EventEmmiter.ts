export class EventEmitter {
    private events: Record<string, undefined | ((data?: any) => void)[]> = {};

    emit(event: string, data?: any) {
        const eventCallbacks = this.events[event];
        if (eventCallbacks) {
            eventCallbacks.forEach(callback => {
                callback.call(undefined, data);
            });
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
}
