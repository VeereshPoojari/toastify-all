class NotificationCore {
    constructor() {
        this.notifications = new Map();
        this.counter = 0;
        this.config = {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: true,
            draggable: true,
            draggablePercent: 80,
            theme: 'light', // 'light' | 'dark' | 'colored' | 'system'
            transition: 'bounce', // 'bounce' | 'slide' | 'zoom' | 'flip'
            limit: null,
            newestOnTop: true,
            closeButton: true,
            sound: false
        };
        this.containers = new Map();
        this.initialized = false;
        this.isWindowFocused = true;

        if (typeof window !== 'undefined') {
            window.addEventListener('focus', () => {
                this.isWindowFocused = true;
                this.resumeAll();
            });
            window.addEventListener('blur', () => {
                this.isWindowFocused = false;
                this.pauseAll();
            });

            try {
                const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkQuery.addEventListener('change', () => {
                    if (this.config.theme === 'system') {
                        this.refreshSystemTheme();
                    }
                });
            } catch (e) { }
        }
    }

    getEffectiveTheme(theme = this.config.theme) {
        if (theme === 'system') {
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return 'light';
        }
        return theme;
    }

    refreshSystemTheme() {
        if (typeof document === 'undefined') return;
        const effectiveTheme = this.getEffectiveTheme('system');
        const position = this.config.position;
        this.containers.forEach((container) => {
            container.className = `notification-container toastify-all-container omnitoast-container ${position} ${effectiveTheme} Toastify__toast-container Toastify__toast-container--${position} theme-${effectiveTheme}`;
        });
    }

    configure(options = {}) {
        this.config = { ...this.config, ...options };
        if (typeof document !== 'undefined') {
            const effectiveTheme = this.getEffectiveTheme(this.config.theme);
            const position = this.config.position;
            this.containers.forEach((container) => {
                container.className = `notification-container toastify-all-container omnitoast-container ${position} ${effectiveTheme} Toastify__toast-container Toastify__toast-container--${position} theme-${effectiveTheme}`;
            });
        }
    }

    init() {
        if (typeof document === 'undefined') return;
        this.injectStyles();
        this.initialized = true;
    }

    getContainer(position = this.config.position) {
        if (typeof document === 'undefined') return null;
        this.init();

        const effectiveTheme = this.getEffectiveTheme(this.config.theme);
        const key = position;

        if (this.containers.has(key)) {
            const existing = this.containers.get(key);
            if (existing && document.body.contains(existing)) {
                return existing;
            }
        }

        const container = document.createElement('div');
        container.className = `notification-container toastify-all-container omnitoast-container ${position} ${effectiveTheme} Toastify__toast-container Toastify__toast-container--${position} theme-${effectiveTheme}`;
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
        this.containers.set(key, container);
        return container;
    }

    playChime(type) {
        if (typeof window === 'undefined') return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

            if (type === 'error') {
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.setValueAtTime(180, now + 0.08);
            } else if (type === 'success') {
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.08);
            } else {
                osc.frequency.setValueAtTime(440, now);
            }

            osc.start(now);
            osc.stop(now + 0.16);
        } catch (e) { }
    }

    injectStyles() {
        if (typeof document === 'undefined' || document.getElementById('omnitoast-styles')) return;

        const style = document.createElement('style');
        style.id = 'omnitoast-styles';
        style.textContent = `
        :root {
          --omnitoast-color-light: #ffffff;
          --omnitoast-color-dark: #18181b;
          --omnitoast-color-info: #3b82f6;
          --omnitoast-color-success: #10b981;
          --omnitoast-color-warning: #f59e0b;
          --omnitoast-color-error: #ef4444;

          --omnitoast-width: 350px;
          --omnitoast-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
          --omnitoast-z-index: 999999;
          --omnitoast-radius: 10px;
        }

        .notification-container,
        .toastify-all-container,
        .omnitoast-container,
        .Toastify__toast-container {
          z-index: var(--omnitoast-z-index);
          position: fixed;
          padding: 12px;
          width: var(--omnitoast-width);
          max-width: 100vw;
          box-sizing: border-box;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .Toastify__toast-container--top-left, .notification-container.top-left { top: 10px; left: 10px; }
        .Toastify__toast-container--top-center, .notification-container.top-center { top: 10px; left: 50%; transform: translateX(-50%); }
        .Toastify__toast-container--top-right, .notification-container.top-right { top: 10px; right: 10px; }
        .Toastify__toast-container--bottom-left, .notification-container.bottom-left { bottom: 10px; left: 10px; }
        .Toastify__toast-container--bottom-center, .notification-container.bottom-center { bottom: 10px; left: 50%; transform: translateX(-50%); }
        .Toastify__toast-container--bottom-right, .notification-container.bottom-right { bottom: 10px; right: 10px; }

        @media only screen and (max-width: 480px) {
          .notification-container,
          .toastify-all-container,
          .omnitoast-container,
          .Toastify__toast-container {
            width: 100vw;
            padding: 8px;
            left: 0 !important;
            margin: 0;
            transform: none !important;
          }
        }

        .notification-toast,
        .toastify-all-toast,
        .omnitoast-toast,
        .Toastify__toast {
          position: relative;
          box-sizing: border-box;
          padding: 12px 14px;
          border-radius: var(--omnitoast-radius);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          overflow: hidden;
          font-family: var(--omnitoast-font-family);
          cursor: default;
          pointer-events: auto;
          user-select: none;
          line-height: 1.45;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        }

        .Toastify__toast--theme-light {
          background: rgba(255, 255, 255, 0.96);
          color: #1f2937;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .Toastify__toast--theme-dark {
          background: rgba(24, 24, 27, 0.95);
          color: #f4f4f5;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
        }

        .Toastify__toast--theme-colored.Toastify__toast--info {
          color: #fff;
          background: var(--omnitoast-color-info);
          border-color: transparent;
        }
        .Toastify__toast--theme-colored.Toastify__toast--success {
          color: #fff;
          background: var(--omnitoast-color-success);
          border-color: transparent;
        }
        .Toastify__toast--theme-colored.Toastify__toast--warning {
          color: #1f2937;
          background: var(--omnitoast-color-warning);
          border-color: transparent;
        }
        .Toastify__toast--theme-colored.Toastify__toast--error {
          color: #fff;
          background: var(--omnitoast-color-error);
          border-color: transparent;
        }

        .Toastify__toast-body {
          flex: 1 1 auto;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: 0;
        }

        .Toastify__toast-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          margin-top: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .Toastify__toast-icon svg {
          width: 100%;
          height: 100%;
        }

        .omnitoast-text-container {
          flex: 1;
          min-width: 0;
        }

        .omnitoast-title {
          font-weight: 600;
          font-size: 13.5px;
          line-height: 1.35;
          margin-bottom: 2px;
        }

        .omnitoast-content {
          font-size: 13px;
          line-height: 1.45;
          word-break: break-word;
          opacity: 0.92;
        }

        .Toastify__close-button {
          color: #9ca3af;
          background: transparent;
          outline: none;
          border: none;
          padding: 2px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.15s ease, color 0.15s ease;
          align-self: flex-start;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 1;
          margin-left: 8px;
          border-radius: 4px;
        }
        .Toastify__close-button:hover {
          opacity: 1;
          color: inherit;
          background: rgba(0, 0, 0, 0.05);
        }

        .Toastify__action-btn {
          margin-top: 6px;
          padding: 5px 12px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: rgba(0, 0, 0, 0.05);
          color: inherit;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          display: inline-block;
        }

        .Toastify__progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          opacity: 0.45;
          transform-origin: left;
        }
        .Toastify__progress-bar--animated {
          animation: Toastify__trackProgress linear 1 forwards;
        }
        .Toastify__progress-bar--info { background: var(--omnitoast-color-info); }
        .Toastify__progress-bar--success { background: var(--omnitoast-color-success); }
        .Toastify__progress-bar--warning { background: var(--omnitoast-color-warning); }
        .Toastify__progress-bar--error { background: var(--omnitoast-color-error); }

        @keyframes Toastify__trackProgress {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }

        @keyframes Toastify__bounceInRight {
          from { opacity: 0; transform: translate3d(200px, 0, 0) scale(0.9); }
          to { transform: none; }
        }
        @keyframes Toastify__bounceOutRight {
          to { opacity: 0; transform: translate3d(250px, 0, 0) scale(0.85); }
        }
        @keyframes Toastify__bounceInLeft {
          from { opacity: 0; transform: translate3d(-200px, 0, 0) scale(0.9); }
          to { transform: none; }
        }
        @keyframes Toastify__bounceOutLeft {
          to { opacity: 0; transform: translate3d(-250px, 0, 0) scale(0.85); }
        }
        @keyframes Toastify__bounceInDown {
          from { opacity: 0; transform: translate3d(0, -50px, 0) scale(0.9); }
          to { transform: none; }
        }
        @keyframes Toastify__bounceOutUp {
          to { opacity: 0; transform: translate3d(0, -60px, 0) scale(0.85); }
        }

        @keyframes Toastify__slideInRight {
          from { transform: translate3d(100%, 0, 0); opacity: 0; }
          to { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes Toastify__slideOutRight {
          to { transform: translate3d(100%, 0, 0); opacity: 0; }
        }
        @keyframes Toastify__slideInLeft {
          from { transform: translate3d(-100%, 0, 0); opacity: 0; }
          to { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes Toastify__slideOutLeft {
          to { transform: translate3d(-100%, 0, 0); opacity: 0; }
        }

        @keyframes Toastify__zoomIn {
          from { opacity: 0; transform: scale3d(0.5, 0.5, 0.5); }
          to { opacity: 1; transform: scale3d(1, 1, 1); }
        }
        @keyframes Toastify__zoomOut {
          to { opacity: 0; transform: scale3d(0.5, 0.5, 0.5); }
        }

        @keyframes Toastify__flipIn {
          from { transform: perspective(400px) rotate3d(1, 0, 0, 90deg); opacity: 0; }
          to { transform: perspective(400px); opacity: 1; }
        }
        @keyframes Toastify__flipOut {
          to { transform: perspective(400px) rotate3d(1, 0, 0, 90deg); opacity: 0; }
        }

        @keyframes Toastify__spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .Toastify__spinner {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          border: 2px solid currentColor;
          border-radius: 50%;
          border-right-color: transparent;
          animation: Toastify__spin 0.75s linear infinite;
        }
      `;
        document.head.appendChild(style);
    }

    getDefaultIcon(type) {
        switch (type) {
            case 'success':
                return '<svg viewBox="0 0 20 20" fill="#10b981"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
            case 'error':
                return '<svg viewBox="0 0 20 20" fill="#ef4444"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';
            case 'warning':
                return '<svg viewBox="0 0 20 20" fill="#f59e0b"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>';
            case 'info':
                return '<svg viewBox="0 0 20 20" fill="#3b82f6"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>';
            case 'loading':
                return '<div class="Toastify__spinner"></div>';
            default:
                return '';
        }
    }

    getAnimationNames(transition, position) {
        const isLeft = position.includes('left');
        const isCenter = position.includes('center');

        switch (transition) {
            case 'slide':
                return {
                    enter: isLeft ? 'Toastify__slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'Toastify__slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    exit: isLeft ? 'Toastify__slideOutLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'Toastify__slideOutRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                };
            case 'zoom':
                return {
                    enter: 'Toastify__zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    exit: 'Toastify__zoomOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                };
            case 'flip':
                return {
                    enter: 'Toastify__flipIn 0.35s ease forwards',
                    exit: 'Toastify__flipOut 0.3s ease forwards'
                };
            case 'bounce':
            default:
                if (isCenter) {
                    return {
                        enter: 'Toastify__bounceInDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        exit: 'Toastify__bounceOutUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    };
                }
                return {
                    enter: isLeft ? 'Toastify__bounceInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'Toastify__bounceInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    exit: isLeft ? 'Toastify__bounceOutLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'Toastify__bounceOutRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                };
        }
    }

    show(type = 'default', message, options = {}) {
        if (typeof document === 'undefined') return 0;
        this.init();

        const id = options.toastId || ++this.counter;
        if (this.notifications.has(id)) {
            this.update(id, { ...options, message, type });
            return id;
        }

        const config = { ...this.config, ...options };
        const position = config.position || this.config.position;
        const container = this.getContainer(position);

        if (!container) return id;

        // Waiting queue limit
        if (config.limit && container.children.length >= config.limit) {
            const firstChild = container.firstElementChild;
            const oldestId = firstChild ? Number(firstChild.getAttribute('data-toast-id')) : null;
            if (oldestId) {
                this.dismiss(oldestId);
            }
        }

        const toast = this.createToast(id, type, message, config, position);

        if (config.newestOnTop) {
            container.insertBefore(toast, container.firstChild);
        } else {
            container.appendChild(toast);
        }

        const entry = {
            id,
            toast,
            type,
            message,
            config,
            position,
            timer: null,
            remainingTime: config.autoClose,
            startTime: Date.now(),
            isPaused: false
        };

        this.notifications.set(id, entry);

        if (config.autoClose !== false) {
            this.setupAutoClose(entry);
        }

        if (config.sound) {
            this.playChime(type);
        }

        if (typeof config.onOpen === 'function') {
            config.onOpen(id);
        }

        return id;
    }

    createToast(id, type, message, config, position) {
        const effectiveTheme = this.getEffectiveTheme(config.theme);
        const transition = config.transition || this.config.transition;
        const animations = this.getAnimationNames(transition, position);

        const toast = document.createElement('div');
        toast.className = `notification-toast toastify-all-toast omnitoast-toast ${type} Toastify__toast Toastify__toast--${type} Toastify__toast--theme-${effectiveTheme} ${config.className || ''}`.trim();
        toast.setAttribute('data-toast-id', id);
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
        toast.style.animation = animations.enter;

        if (config.style && typeof config.style === 'object') {
            Object.assign(toast.style, config.style);
        }

        const body = document.createElement('div');
        body.className = `Toastify__toast-body ${config.bodyClassName || ''}`.trim();
        if (config.bodyStyle) Object.assign(body.style, config.bodyStyle);

        if (config.icon !== false) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'Toastify__toast-icon';
            if (typeof config.icon === 'string') {
                iconWrapper.innerHTML = config.icon;
            } else if (config.icon instanceof Node) {
                iconWrapper.appendChild(config.icon);
            } else {
                iconWrapper.innerHTML = this.getDefaultIcon(type);
            }
            body.appendChild(iconWrapper);
        }

        const textWrapper = document.createElement('div');
        textWrapper.className = 'omnitoast-text-container';

        if (config.title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'omnitoast-title';
            titleEl.textContent = config.title;
            textWrapper.appendChild(titleEl);
        }

        const contentEl = document.createElement('div');
        contentEl.className = 'omnitoast-content';

        if (message instanceof Node) {
            contentEl.appendChild(message);
        } else if (typeof message === 'string') {
            contentEl.textContent = message;
        } else {
            contentEl.textContent = String(message);
        }
        textWrapper.appendChild(contentEl);

        if (config.action && config.action.label) {
            const actionBtn = document.createElement('button');
            actionBtn.type = 'button';
            actionBtn.className = 'Toastify__action-btn';
            actionBtn.textContent = config.action.label;
            actionBtn.onclick = (e) => {
                e.stopPropagation();
                if (typeof config.action.onClick === 'function') {
                    config.action.onClick(id);
                }
                if (config.action.autoDismiss !== false) {
                    this.dismiss(id);
                }
            };
            textWrapper.appendChild(actionBtn);
        }

        body.appendChild(textWrapper);
        toast.appendChild(body);

        if (config.closeButton !== false) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'Toastify__close-button';
            closeBtn.setAttribute('aria-label', 'Close');
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                this.dismiss(id);
            };
            toast.appendChild(closeBtn);
        }

        if (!config.hideProgressBar && config.autoClose !== false) {
            const progress = document.createElement('div');
            progress.className = `Toastify__progress-bar Toastify__progress-bar--animated Toastify__progress-bar--${type} ${config.progressClassName || ''}`.trim();
            progress.style.animationDuration = `${config.autoClose}ms`;
            if (config.progressStyle) Object.assign(progress.style, config.progressStyle);
            toast.appendChild(progress);
        }

        if (config.closeOnClick !== false) {
            toast.style.cursor = 'pointer';
            toast.onclick = (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    this.dismiss(id);
                }
            };
        }

        if (config.draggable !== false) {
            this.makeDraggable(toast, id, config);
        }

        if (config.pauseOnHover !== false) {
            this.setupHoverPause(toast, id);
        }

        return toast;
    }

    setupAutoClose(entry) {
        const delay = entry.remainingTime;
        entry.startTime = Date.now();
        entry.timer = setTimeout(() => {
            this.dismiss(entry.id);
        }, delay);
    }

    setupHoverPause(toast, id) {
        toast.addEventListener('mouseenter', () => {
            this.pauseToast(id);
        });

        toast.addEventListener('mouseleave', () => {
            this.resumeToast(id);
        });
    }

    pauseToast(id) {
        const entry = this.notifications.get(id);
        if (!entry || entry.isPaused || !entry.timer) return;

        clearTimeout(entry.timer);
        entry.timer = null;
        entry.isPaused = true;

        const elapsed = Date.now() - entry.startTime;
        entry.remainingTime = Math.max(0, entry.remainingTime - elapsed);

        const progress = entry.toast.querySelector('.Toastify__progress-bar');
        if (progress) {
            progress.style.animationPlayState = 'paused';
        }
    }

    resumeToast(id) {
        const entry = this.notifications.get(id);
        if (!entry || !entry.isPaused || entry.remainingTime <= 0) return;

        entry.isPaused = false;
        const progress = entry.toast.querySelector('.Toastify__progress-bar');
        if (progress) {
            progress.style.animationPlayState = 'running';
        }

        this.setupAutoClose(entry);
    }

    pauseAll() {
        this.notifications.forEach((_, id) => this.pauseToast(id));
    }

    resumeAll() {
        this.notifications.forEach((_, id) => this.resumeToast(id));
    }

    makeDraggable(toast, id, config) {
        let startX = null;
        let currentX = null;

        const handleStart = (e) => {
            startX = e.type === 'mousedown' ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
            currentX = startX;
            toast.style.transition = 'none';
        };

        const handleMove = (e) => {
            if (startX === null) return;
            currentX = e.type === 'mousemove' ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
            if (currentX === null) return;
            const deltaX = currentX - startX;
            toast.style.transform = `translate3d(${deltaX}px, 0, 0)`;
            toast.style.opacity = `${1 - Math.abs(deltaX) / (toast.offsetWidth * 1.5)}`;
        };

        const handleEnd = () => {
            if (startX === null || currentX === null) return;
            const deltaX = currentX - startX;
            toast.style.transition = 'all 0.25s ease';

            const threshold = (toast.offsetWidth * (config.draggablePercent || 80)) / 100;
            if (Math.abs(deltaX) > threshold) {
                this.dismiss(id);
            } else {
                toast.style.transform = 'translate3d(0, 0, 0)';
                toast.style.opacity = '1';
            }

            startX = null;
            currentX = null;
        };

        toast.addEventListener('mousedown', handleStart);
        toast.addEventListener('touchstart', handleStart, { passive: true });
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: true });
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
    }

    update(id, newState = {}) {
        const entry = this.notifications.get(id);
        if (!entry) return;

        const { toast } = entry;
        const content = toast.querySelector('.omnitoast-content') || toast.querySelector('.Toastify__toast-body');
        const iconWrapper = toast.querySelector('.Toastify__toast-icon');

        if (newState.render) {
            newState.message = newState.render;
        }

        if (newState.message !== undefined && content) {
            content.textContent = '';
            if (newState.message instanceof Node) {
                content.appendChild(newState.message);
            } else {
                content.textContent = String(newState.message);
            }
            entry.message = newState.message;
        }

        if (newState.type && newState.type !== entry.type) {
            toast.className = toast.className.replace(entry.type, newState.type);
            toast.className = toast.className.replace(`Toastify__toast--${entry.type}`, `Toastify__toast--${newState.type}`);
            entry.type = newState.type;
            if (iconWrapper) {
                iconWrapper.innerHTML = this.getDefaultIcon(newState.type);
            }
        }

        if (newState.autoClose !== undefined) {
            if (entry.timer) clearTimeout(entry.timer);
            if (newState.autoClose !== false) {
                entry.remainingTime = newState.autoClose;
                const progress = toast.querySelector('.Toastify__progress-bar');
                if (progress) {
                    progress.style.animationDuration = `${newState.autoClose}ms`;
                }
                this.setupAutoClose(entry);
            }
        }
    }

    dismiss(id) {
        if (id === undefined) {
            this.clearAll();
            return;
        }

        const entry = this.notifications.get(id);
        if (!entry) return;

        const { toast, config, position } = entry;
        if (entry.timer) clearTimeout(entry.timer);

        const transition = config.transition || this.config.transition;
        const animations = this.getAnimationNames(transition, position);
        toast.style.animation = animations.exit;

        if (typeof config.onClose === 'function') {
            config.onClose(id);
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.notifications.delete(id);
        }, 280);
    }

    isActive(id) {
        return this.notifications.has(id);
    }

    clearWaitingQueue() {
        this.containers.forEach((container) => {
            const toasts = Array.from(container.children);
            toasts.slice(this.config.limit || 5).forEach((toast) => {
                const id = Number(toast.getAttribute('data-toast-id'));
                if (id) this.dismiss(id);
            });
        });
    }

    clearAll() {
        this.notifications.forEach((_, id) => {
            this.dismiss(id);
        });
        this.containers.forEach((container) => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });
        this.containers.clear();
    }

    promise(promiseOrFn, states = {}, options = {}) {
        const p = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
        const pendingMsg = states.pending || states.loading || 'Loading...';
        const id = this.show('loading', pendingMsg, { ...options, autoClose: false });

        return p
            .then((data) => {
                const successMsg = typeof states.success === 'function'
                    ? states.success(data)
                    : (states.success || 'Success!');
                this.update(id, {
                    type: 'success',
                    render: successMsg,
                    autoClose: options.autoClose !== undefined ? options.autoClose : 5000
                });
                if (options.sound || this.config.sound) {
                    this.playChime('success');
                }
                return data;
            })
            .catch((err) => {
                const errorMsg = typeof states.error === 'function'
                    ? states.error(err)
                    : (states.error || (err && err.message) || 'Error occurred');
                this.update(id, {
                    type: 'error',
                    render: errorMsg,
                    autoClose: options.autoClose !== undefined ? options.autoClose : 5000
                });
                if (options.sound || this.config.sound) {
                    this.playChime('error');
                }
                throw err;
            });
    }
}

export default NotificationCore;