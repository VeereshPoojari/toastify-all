// examples/react/App.jsx
import React, { useState } from 'react';
// import { NotificationProvider, useToast } from 'notification-all/react';
import { NotificationProvider, useToast } from '../../../dist/react';

const NotificationDemo = () => {
    const toast = useToast();
    const [theme, setTheme] = useState('light');
    const [position, setPosition] = useState('top-right');
    const [loadingId, setLoadingId] = useState(null);

    const showSuccess = () => {
        toast.success('✅ React operation successful!');
    };

    const showError = () => {
        toast.error('❌ React error occurred!');
    };

    const showWarning = () => {
        toast.warn('⚠️ React warning message!');
    };

    const showInfo = () => {
        toast.info('ℹ️ React info message!');
    };

    const showLoading = () => {
        if (loadingId) {
            toast.update(loadingId, {
                type: 'success',
                message: '✅ React loading completed!'
            });
            setLoadingId(null);
        } else {
            const id = toast.loading('🔄 React processing...');
            setLoadingId(id);

            setTimeout(() => {
                toast.update(id, {
                    type: 'success',
                    message: '✅ React processing completed!'
                });
                setLoadingId(null);
            }, 3000);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        toast.configure({ theme: newTheme });
        toast.info(`Switched to ${newTheme} theme`);
    };

    const changePosition = (newPosition) => {
        setPosition(newPosition);
        toast.configure({ position: newPosition });
        toast.info(`Position changed to ${newPosition}`);
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            background: theme === 'dark' ? '#1f2937' : '#f5f5f5',
            color: theme === 'dark' ? '#f9fafb' : '#1f2937',
            minHeight: '100vh'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: theme === 'dark' ? '#374151' : 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h1>🔔 Notification-All React Example</h1>
                <p>Click the buttons below to see different types of notifications:</p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <Button onClick={showSuccess} color="#10b981">Success</Button>
                    <Button onClick={showError} color="#ef4444">Error</Button>
                    <Button onClick={showWarning} color="#f59e0b">Warning</Button>
                    <Button onClick={showInfo} color="#3b82f6">Info</Button>
                    <Button onClick={showLoading} color="#6b7280">
                        {loadingId ? 'Complete Loading' : 'Loading'}
                    </Button>
                    <Button onClick={toggleTheme} color="#8b5cf6">Toggle Theme</Button>
                    <Button onClick={() => toast.clearAll()} color="#374151">Clear All</Button>
                </div>

                <div>
                    <h3>Available Positions:</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                            <Button
                                key={pos}
                                onClick={() => changePosition(pos)}
                                color={position === pos ? '#10b981' : '#6b7280'}
                            >
                                {pos}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Button = ({ children, onClick, color }) => (
    <button
        onClick={onClick}
        style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            background: color,
            color: 'white'
        }}
    >
        {children}
    </button>
);

const App = () => {
    return (
        <NotificationProvider options={{ theme: 'light', position: 'top-right' }}>
            <NotificationDemo />
        </NotificationProvider>
    );
};

export default App;