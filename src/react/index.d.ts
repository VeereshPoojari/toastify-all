import React, { ReactNode } from 'react';
import { NotificationOptions, ToastCallable } from '../types/index';

export interface ToastContainerProps extends NotificationOptions {}

export interface NotificationProviderProps {
    children: ReactNode;
    options?: NotificationOptions;
}

export declare const ToastContainer: React.FC<ToastContainerProps>;
export declare const NotificationProvider: React.FC<NotificationProviderProps>;
export declare const useToast: () => ToastCallable;
export declare const toast: ToastCallable;
export default toast;