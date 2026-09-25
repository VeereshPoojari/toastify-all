
// tests/core.test.js
import { alertService } from '../src/core/AlertService.js';

// Mock DOM
document.body.innerHTML = '';

describe('AlertService', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    alertService.clearAll();
  });

  test('should show success notification', () => {
    const id = alertService.success('Test success message');
    expect(id).toBeGreaterThan(0);
    
    const container = document.querySelector('.notification-container');
    expect(container).toBeTruthy();
    
    const toast = document.querySelector('.notification-toast.success');
    expect(toast).toBeTruthy();
    expect(toast.textContent).toContain('Test success message');
  });

  test('should show error notification', () => {
    const id = alertService.error('Test error message');
    expect(id).toBeGreaterThan(0);
    
    const toast = document.querySelector('.notification-toast.error');
    expect(toast).toBeTruthy();
    expect(toast.textContent).toContain('Test error message');
  });

  test('should configure options', () => {
    alertService.configure({ position: 'bottom-left', theme: 'dark' });
    alertService.info('Test message');
    
    const container = document.querySelector('.notification-container');
    expect(container.classList.contains('bottom-left')).toBe(true);
    expect(container.classList.contains('dark')).toBe(true);
  });

  test('should update notification', () => {
    const id = alertService.loading('Loading...');
    alertService.update(id, { type: 'success', message: 'Complete!' });
    
    const toast = document.querySelector('.notification-toast.success');
    expect(toast).toBeTruthy();
    expect(toast.textContent).toContain('Complete!');
  });

  test('should dismiss notification', (done) => {
    const id = alertService.info('Test message');
    const toast = document.querySelector('.notification-toast');
    expect(toast).toBeTruthy();
    
    alertService.dismiss(id);
    
    setTimeout(() => {
      const toastAfter = document.querySelector('.notification-toast');
      expect(toastAfter).toBeFalsy();
      done();
    }, 350);
  });
});