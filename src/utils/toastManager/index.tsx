import styles from './index.module.scss';

type ToastHandle = {
    id: number;
    dismiss: () => void;
};

const ROOT_ID = 'toast-container';
let container: HTMLDivElement | null = null;
let nextId = 1;

function ensureContainer() {
    if (typeof window === 'undefined') return null;
    if (!container) {
        const existing = document.getElementById(ROOT_ID) as HTMLDivElement | null;
        if (existing) {
            container = existing;
        } else {
            container = document.createElement('div');
            container.id = ROOT_ID;

            container.className = styles.container;
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('role', 'status');
            document.body.appendChild(container);
        }
    }
    return container;
}

export const toast = {
    show(message: string, duration = 2000): ToastHandle | void {
        const root = ensureContainer();
        if (!root) return;

        const id = nextId++;
        const el = document.createElement('div');

        el.className = styles.toast;
        el.dataset.id = String(id);
        el.textContent = message;

        root.appendChild(el);

        requestAnimationFrame(() => {
            el.classList.add(styles.enter);
        });

        const removeAfterAnimation = () => {
            el.removeEventListener('animationend', handleAnimationEnd as EventListener);
            if (el.parentNode) el.parentNode.removeChild(el);
        };

        const handleAnimationEnd = (ev: AnimationEvent) => {
            if ((ev.target as HTMLElement) === el && el.classList.contains(styles.exit)) {
                removeAfterAnimation();
            }
        };

        el.addEventListener('animationend', handleAnimationEnd as EventListener);

        const exitTimeout = window.setTimeout(() => {
            el.classList.remove(styles.enter);
            el.classList.add(styles.exit);
            window.setTimeout(removeAfterAnimation, 700);
        }, duration);

        return {
            id,
            dismiss: () => {
                clearTimeout(exitTimeout);

                if (!el.classList.contains(styles.exit)) {
                    el.classList.remove(styles.enter);
                    el.classList.add(styles.exit);
                }
            },
        };
    },
};

export default toast;