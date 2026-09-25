import NotificationCore from './NotificationCore.js';

class AlertService {
    constructor() {
        this.core = new NotificationCore();
    }

    configure(options) {
        this.core.configure(options);
    }

    show(type, message, options) {
        return this.core.show(type, message, options);
    }

    success(message, options) {
        return this.core.show('success', message, options);
    }

    error(message, options) {
        return this.core.show('error', message, options);
    }

    info(message, options) {
        return this.core.show('info', message, options);
    }

    warn(message, options) {
        return this.core.show('warning', message, options);
    }

    warning(message, options) {
        return this.core.show('warning', message, options);
    }

    loading(message, options) {
        return this.core.show('loading', message, { ...options, autoClose: false });
    }

    custom(content, options) {
        return this.core.show('custom', content, options);
    }

    promise(promiseOrFn, states, options) {
        return this.core.promise(promiseOrFn, states, options);
    }

    update(id, newState) {
        this.core.update(id, newState);
    }

    dismiss(id) {
        if (id !== undefined) {
            this.core.dismiss(id);
        } else {
            this.core.clearAll();
        }
    }

    isActive(id) {
        return this.core.isActive(id);
    }

    clearWaitingQueue() {
        this.core.clearWaitingQueue();
    }

    clearAll() {
        this.core.clearAll();
    }
}

// Create singleton instance
const alertService = new AlertService();

// Create callable toast function like react-toastify: toast("msg") or toast.success("msg")
function createCallableToast(service) {
    const toast = function (content, options = {}) {
        return service.core.show('default', content, options);
    };

    toast.configure = (options) => service.configure(options);
    toast.success = (content, options) => service.success(content, options);
    toast.error = (content, options) => service.error(content, options);
    toast.info = (content, options) => service.info(content, options);
    toast.warning = (content, options) => service.warning(content, options);
    toast.warn = (content, options) => service.warn(content, options);
    toast.loading = (content, options) => service.loading(content, options);
    toast.custom = (content, options) => service.custom(content, options);
    toast.promise = (promiseOrFn, states, options) => service.promise(promiseOrFn, states, options);
    toast.update = (id, newState) => service.update(id, newState);
    toast.dismiss = (id) => service.dismiss(id);
    toast.isActive = (id) => service.isActive(id);
    toast.clearWaitingQueue = () => service.clearWaitingQueue();
    toast.clearAll = () => service.clearAll();
    toast.core = service.core;

    return toast;
}

const toast = createCallableToast(alertService);

if (typeof window !== 'undefined') {
    window.ToastifyAll = window.ToastifyAll || { toast, alertService, AlertService };
    window.OmniToast = window.OmniToast || window.ToastifyAll;
}

export { AlertService, alertService, toast };
export default toast;