import { Injectable, Inject, Optional } from '@angular/core';
import { alertService, AlertService } from '../core/AlertService.js';
import type { NotificationOptions, NotificationUpdateState, PromiseToastOptions } from '../types/index';

export const NOTIFICATION_CONFIG = 'NOTIFICATION_CONFIG';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private service: AlertService;

    constructor(
        @Optional() @Inject(NOTIFICATION_CONFIG) private config?: NotificationOptions
    ) {
        this.service = alertService;
        if (this.config) {
            this.service.configure(this.config);
        }
    }

    configure(options: NotificationOptions) {
        this.service.configure(options);
    }

    success(message: string, options?: NotificationOptions) {
        return this.service.success(message, options);
    }

    error(message: string, options?: NotificationOptions) {
        return this.service.error(message, options);
    }

    info(message: string, options?: NotificationOptions) {
        return this.service.info(message, options);
    }

    warn(message: string, options?: NotificationOptions) {
        return this.service.warn(message, options);
    }

    warning(message: string, options?: NotificationOptions) {
        return this.service.warning(message, options);
    }

    loading(message: string, options?: NotificationOptions) {
        return this.service.loading(message, options);
    }

    custom(content: string, options?: NotificationOptions) {
        return this.service.custom(content, options);
    }

    promise<T>(
        promiseOrFn: Promise<T> | (() => Promise<T>),
        states?: PromiseToastOptions<T>,
        options?: NotificationOptions
    ) {
        return this.service.promise(promiseOrFn, states, options);
    }

    update(id: number, newState: NotificationUpdateState) {
        this.service.update(id, newState);
    }

    dismiss(id: number) {
        this.service.dismiss(id);
    }

    clearAll() {
        this.service.clearAll();
    }
}

/**
 * Standalone provider helper for Angular 14+ / 15+ / 16+ / 17+
 */
export function provideNotifications(config?: NotificationOptions) {
    return [
        NotificationService,
        { provide: NOTIFICATION_CONFIG, useValue: config }
    ];
}

export { alertService, alertService as toast };
export default NotificationService;