import { SCROLL_CONFIG } from "@/shared/config";

export function smoothScrollToElement(elementId: string, delay: number = SCROLL_CONFIG.delay) {
    setTimeout(() => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const targetPosition =
            element.getBoundingClientRect().top + window.scrollY + SCROLL_CONFIG.offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function easeInOutCubic(t: number): number {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animation(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / SCROLL_CONFIG.duration, 1);
            const easeProgress = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }, delay);
}
