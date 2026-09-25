import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, ToastAndroid, Platform } from 'react-native';

class ReactNativeNotificationManager {
    constructor() {
        this.listeners = new Set();
        this.notifications = new Map();
        this.counter = 0;
        this.config = {
            autoClose: 3500,
            useNativeAlertOnIOS: true,
            useNativeToastOnAndroid: true
        };
    }

    configure(options = {}) {
        this.config = { ...this.config, ...options };
    }

    addListener(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners() {
        const list = Array.from(this.notifications.values());
        this.listeners.forEach((listener) => listener(list));
    }

    show(type, message, options = {}) {
        const id = ++this.counter;
        const text = typeof message === 'string' ? message : String(message);
        const title = options.title || (type.charAt(0).toUpperCase() + type.slice(1));

        // Use native Android Toast if on Android
        if (Platform && Platform.OS === 'android' && this.config.useNativeToastOnAndroid && typeof ToastAndroid !== 'undefined') {
            try {
                ToastAndroid.show(text, ToastAndroid.SHORT);
            } catch (e) {
                // fallback
            }
        } else if (Platform && Platform.OS === 'ios' && this.config.useNativeAlertOnIOS && typeof Alert !== 'undefined') {
            Alert.alert(title, text);
        }

        const entry = { id, type, message: text, title, options };
        this.notifications.set(id, entry);
        this.notifyListeners();

        const duration = options.autoClose !== undefined ? options.autoClose : this.config.autoClose;
        if (duration !== false) {
            setTimeout(() => {
                this.dismiss(id);
            }, duration);
        }

        return id;
    }

    success(message, options) { return this.show('success', message, options); }
    error(message, options) { return this.show('error', message, options); }
    info(message, options) { return this.show('info', message, options); }
    warn(message, options) { return this.show('warning', message, options); }
    warning(message, options) { return this.show('warning', message, options); }
    loading(message, options) { return this.show('loading', message, { ...options, autoClose: false }); }

    promise(promiseOrFn, states = {}, options = {}) {
        const p = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
        const id = this.loading(states.pending || states.loading || 'Loading...', options);

        return p
            .then((data) => {
                const successMsg = typeof states.success === 'function' ? states.success(data) : (states.success || 'Success!');
                this.dismiss(id);
                this.success(successMsg, options);
                return data;
            })
            .catch((err) => {
                const errorMsg = typeof states.error === 'function' ? states.error(err) : (states.error || (err && err.message) || 'Error occurred');
                this.dismiss(id);
                this.error(errorMsg, options);
                throw err;
            });
    }

    dismiss(id) {
        if (id !== undefined) {
            this.notifications.delete(id);
        } else {
            this.notifications.clear();
        }
        this.notifyListeners();
    }

    clearAll() {
        this.dismiss();
    }
}

const rnManager = new ReactNativeNotificationManager();

function createRNToast(manager) {
    const toast = function (message, options) {
        return manager.show('default', message, options);
    };
    toast.configure = (opts) => manager.configure(opts);
    toast.success = (msg, opts) => manager.success(msg, opts);
    toast.error = (msg, opts) => manager.error(msg, opts);
    toast.info = (msg, opts) => manager.info(msg, opts);
    toast.warning = (msg, opts) => manager.warning(msg, opts);
    toast.warn = (msg, opts) => manager.warn(msg, opts);
    toast.loading = (msg, opts) => manager.loading(msg, opts);
    toast.promise = (p, states, opts) => manager.promise(p, states, opts);
    toast.dismiss = (id) => manager.dismiss(id);
    toast.clearAll = () => manager.clearAll();
    return toast;
}

export const toast = createRNToast(rnManager);

const ToastContext = createContext(toast);

export const NotificationProvider = ({ children, options = {} }) => {
    useEffect(() => {
        if (options && Object.keys(options).length > 0) {
            toast.configure(options);
        }
    }, [options]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext) || toast;

export default toast;