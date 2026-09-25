import { NotificationOptions, NotificationUpdateState, PromiseToastOptions, AlertService } from '../types/index';

export declare const NOTIFICATION_CONFIG = 'NOTIFICATION_CONFIG';

export declare class NotificationService {
    private service: AlertService;
    private config?: NotificationOptions;
    constructor(config?: NotificationOptions);
    configure(options: NotificationOptions): void;
    success(message: string, options?: NotificationOptions): number;
    error(message: string, options?: NotificationOptions): number;
    info(message: string, options?: NotificationOptions): number;
    warn(message: string, options?: NotificationOptions): number;
    warning(message: string, options?: NotificationOptions): number;
    loading(message: string, options?: NotificationOptions): number;
    custom(content: string, options?: NotificationOptions): number;
    promise<T>(
        promiseOrFn: Promise<T> | (() => Promise<T>),
        states?: PromiseToastOptions<T>,
        options?: NotificationOptions
    ): Promise<T>;
    update(id: number, newState: NotificationUpdateState): void;
    dismiss(id: number): void;
    clearAll(): void;
}

export declare function provideNotifications(config?: NotificationOptions): any[];
export declare const toast: AlertService;
export declare const alertService: AlertService;
export default NotificationService;
