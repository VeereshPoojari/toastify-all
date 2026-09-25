import { ReactNode } from 'react';
import { NotificationOptions, ToastCallable } from '../types/index';

export interface ReactNativeToastOptions extends NotificationOptions {
    useNativeAlertOnIOS?: boolean;
    useNativeToastOnAndroid?: boolean;
}

export interface NotificationProviderProps {
    children: ReactNode;
    options?: ReactNativeToastOptions;
}

export declare const NotificationProvider: React.FC<NotificationProviderProps>;
export declare const useToast: () => ToastCallable;
export declare const toast: ToastCallable;
export default toast;