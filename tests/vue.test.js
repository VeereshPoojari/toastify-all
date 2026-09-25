// tests/vue.test.js
import NotificationPlugin, { useNotifications, useToast, toast } from '../src/vue/index.js';

describe('Vue Integration', () => {
    test('NotificationPlugin should install on Vue app', () => {
        const mockApp = {
            config: { globalProperties: {} },
            provide: jest.fn()
        };

        NotificationPlugin.install(mockApp, { theme: 'dark' });

        expect(mockApp.config.globalProperties.$toast).toBeDefined();
        expect(mockApp.provide).toHaveBeenCalledWith('toast', toast);
        expect(mockApp.provide).toHaveBeenCalledWith('notifications', toast);
    });

    test('useToast and useNotifications should return toast service', () => {
        expect(useToast()).toBe(toast);
        expect(useNotifications()).toBe(toast);
        expect(typeof toast.success).toBe('function');
        expect(typeof toast.error).toBe('function');
        expect(typeof toast.promise).toBe('function');
    });
});
