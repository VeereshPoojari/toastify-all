import React, { createContext, useContext, useEffect } from 'react';
import { toast, alertService } from '../core/AlertService.js';

const ToastContext = createContext(toast);

/**
 * ToastContainer component like react-toastify
 * Can be placed once at the root of the app.
 */
export const ToastContainer = (props = {}) => {
    const {
        position,
        autoClose,
        hideProgressBar,
        newestOnTop,
        closeOnClick,
        pauseOnHover,
        pauseOnFocusLoss,
        draggable,
        theme,
        transition,
        limit,
        className,
        style,
        ...rest
    } = props;

    useEffect(() => {
        const config = {};
        if (position !== undefined) config.position = position;
        if (autoClose !== undefined) {
            config.autoClose = (autoClose === false || autoClose === 'false')
                ? false
                : (!isNaN(Number(autoClose)) ? Number(autoClose) : autoClose);
        }
        if (hideProgressBar !== undefined) config.hideProgressBar = Boolean(hideProgressBar);
        if (newestOnTop !== undefined) config.newestOnTop = Boolean(newestOnTop);
        if (closeOnClick !== undefined) config.closeOnClick = Boolean(closeOnClick);
        if (pauseOnHover !== undefined) config.pauseOnHover = Boolean(pauseOnHover);
        if (pauseOnFocusLoss !== undefined) config.pauseOnFocusLoss = Boolean(pauseOnFocusLoss);
        if (draggable !== undefined) config.draggable = Boolean(draggable);
        if (theme !== undefined) config.theme = theme;
        if (transition !== undefined) config.transition = transition;
        if (limit !== undefined) config.limit = limit;
        if (className !== undefined) config.className = className;
        if (style !== undefined) config.style = style;
        Object.assign(config, rest);

        toast.configure(config);
    }, [
        position,
        autoClose,
        hideProgressBar,
        newestOnTop,
        closeOnClick,
        pauseOnHover,
        pauseOnFocusLoss,
        draggable,
        theme,
        transition,
        limit,
        className,
        style,
        JSON.stringify(rest)
    ]);

    return null;
};

/**
 * NotificationProvider for React Context users
 */
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

export const useToast = () => {
    const context = useContext(ToastContext);
    return context || toast;
};

export { toast, alertService };
export default toast;
