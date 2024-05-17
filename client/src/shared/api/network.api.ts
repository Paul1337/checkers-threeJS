import { io, Socket } from 'socket.io-client';

export class Network {
    private readonly io: Socket;

    constructor() {
        this.io = io(import.meta.env.VITE_WS_SERVER_URL);
    }

    emit(ev: string, data: any) {
        this.io.emit(ev, data);
    }

    on(ev: string, listener: (data: any) => void) {
        this.io.on(ev, listener);
    }
}

export const network = new Network();
