// tests/angular.test.ts
jest.mock('@angular/core', () => ({
    Injectable: () => (target: any) => target,
    Inject: () => () => {},
    Optional: () => () => {},
}));

import { NotificationService, provideNotifications, NOTIFICATION_CONFIG } from '../src/angular/index';

describe('Angular Integration', () => {
    test('NotificationService should instantiate and expose notification methods', () => {
        const service = new NotificationService({ position: 'top-left', theme: 'light' });
        expect(service).toBeDefined();
        expect(typeof service.success).toBe('function');
        expect(typeof service.error).toBe('function');
        expect(typeof service.warning).toBe('function');
        expect(typeof service.info).toBe('function');
        expect(typeof service.loading).toBe('function');
        expect(typeof service.promise).toBe('function');
    });

    test('provideNotifications should return Angular provider array', () => {
        const providers = provideNotifications({ theme: 'dark' });
        expect(Array.isArray(providers)).toBe(true);
        expect(providers.length).toBe(2);
        expect(providers[0]).toBe(NotificationService);
        expect(providers[1]).toEqual({ provide: NOTIFICATION_CONFIG, useValue: { theme: 'dark' } });
    });
});
