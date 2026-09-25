export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning' | 'loading' | 'custom';

export type ToastTheme = 'light' | 'dark' | 'colored' | 'system';

export type ToastTransition = 'bounce' | 'slide' | 'zoom' | 'flip';

export interface ToastAction {
    label: string;
    onClick?: (id: number) => void;
    autoDismiss?: boolean;
}

export interface NotificationOptions {
    toastId?: number;
    position?: ToastPosition;
    autoClose?: number | false;
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    pauseOnHover?: boolean;
    pauseOnFocusLoss?: boolean;
    draggable?: boolean;
    draggablePercent?: number;
    theme?: ToastTheme;
    transition?: ToastTransition;
    title?: string;
    description?: string;
    sound?: boolean;
    className?: string;
    bodyClassName?: string;
    progressClassName?: string;
    style?: Record<string, string | number>;
    bodyStyle?: Record<string, string | number>;
    progressStyle?: Record<string, string | number>;
    icon?: string | Node | boolean;
    action?: ToastAction;
    closeButton?: boolean;
    limit?: number | null;
    newestOnTop?: boolean;
    onOpen?: (id: number) => void;
    onClose?: (id: number) => void;
}

export interface NotificationUpdateState {
    type?: ToastType;
    message?: string | Node;
    render?: string | Node;
    autoClose?: number | false;
}

export interface PromiseToastOptions<T> {
    pending?: string;
    loading?: string;
    success?: string | ((data: T) => string);
    error?: string | ((error: any) => string);
}

export interface AlertService {
    configure(options: NotificationOptions): void;
    show(type: ToastType, message: string | Node, options?: NotificationOptions): number;
    success(message: string | Node, options?: NotificationOptions): number;
    error(message: string | Node, options?: NotificationOptions): number;
    info(message: string | Node, options?: NotificationOptions): number;
    warn(message: string | Node, options?: NotificationOptions): number;
    warning(message: string | Node, options?: NotificationOptions): number;
    loading(message: string | Node, options?: NotificationOptions): number;
    custom(content: string | Node, options?: NotificationOptions): number;
    promise<T>(
        promiseOrFn: Promise<T> | (() => Promise<T>),
        states?: PromiseToastOptions<T>,
        options?: NotificationOptions
    ): Promise<T>;
    update(id: number, newState: NotificationUpdateState): void;
    dismiss(id?: number): void;
    isActive(id: number): boolean;
    clearWaitingQueue(): void;
    clearAll(): void;
}

export interface ToastCallable extends AlertService {
    (content: string | Node, options?: NotificationOptions): number;
}

declare const alertService: AlertService;
declare const toast: ToastCallable;

export { AlertService, alertService, toast };
export default toast;
