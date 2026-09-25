import { App } from 'vue';
import { NotificationOptions, ToastCallable } from '../types/index';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $toast: ToastCallable;
    }
}

export interface NotificationPluginOptions extends NotificationOptions { }

export declare const NotificationPlugin: {
    install(app: App, options?: NotificationPluginOptions): void;
};

export declare const useNotifications: () => ToastCallable;
export declare const useToast: () => ToastCallable;
export declare const toast: ToastCallable;
export default NotificationPlugin;