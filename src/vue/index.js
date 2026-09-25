import { toast, alertService } from '../core/AlertService.js';

const NotificationPlugin = {
  install(app, options = {}) {
    if (options && Object.keys(options).length > 0) {
      toast.configure(options);
    }

    app.config.globalProperties.$toast = toast;
    app.provide('toast', toast);
    app.provide('notifications', toast);
  }
};

export const useNotifications = () => toast;
export const useToast = () => toast;

export const ToastifyAllPlugin = NotificationPlugin;
export const ToastifyPlugin = NotificationPlugin;
export const OmniToastPlugin = NotificationPlugin;

export { toast, alertService, NotificationPlugin };
export default NotificationPlugin;