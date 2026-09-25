

// tests/react.test.jsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { NotificationProvider, useToast } from '../src/react/index.jsx';

const TestComponent = () => {
    const toast = useToast();

    return (
        <div>
            <button onClick={() => toast.success('React success!')}>
                Success
            </button>
            <button onClick={() => toast.error('React error!')}>
                Error
            </button>
        </div>
    );
};

describe('React Integration', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should work with NotificationProvider', () => {
        render(
            <NotificationProvider options={{ theme: 'dark' }}>
                <TestComponent />
            </NotificationProvider>
        );

        const successButton = screen.getByText('Success');
        fireEvent.click(successButton);

        const toast = document.querySelector('.notification-toast.success');
        expect(toast).toBeTruthy();
        expect(toast.textContent).toContain('React success!');
    });

    test('should work without provider', () => {
        render(<TestComponent />);

        const errorButton = screen.getByText('Error');
        fireEvent.click(errorButton);

        const toast = document.querySelector('.notification-toast.error');
        expect(toast).toBeTruthy();
        expect(toast.textContent).toContain('React error!');
    });
});