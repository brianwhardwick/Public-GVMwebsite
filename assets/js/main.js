/**
 * Project GVM - Main Site Logic
 * Structure: Module Pattern (IIFE)
 */

const GVMApp = (function() {
    'use strict';

    // --- 1. Private Variables (State) ---
    const config = {
        appUrl: "https://gvmcalculator.streamlit.app/?embed=true&theme=light",
        selectors: {
            year: "#year",
            checkbox: "#acknowledge",
            startBtn: "#startBtn",
            appContainer: "#app-container",
            iframe: "#gvm-frame",
            loader: "#loader",
            intro: ".card-intro", // Renamed from seo-content for standard naming
            footerContent: ".footer-content",
            wrapper: ".main-wrapper",
            faqDetails: ".faq-item details"
        }
    };

    // --- 2. Private Methods ---

    /**
     * Updates the copyright year in the footer
     */
    const initDynamicYear = () => {
        const yearEl = document.querySelector(config.selectors.year);
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    };

    /**
     * Handles GA4 Event Tracking safely
     */
    const trackEvent = (name, label, value = 1) => {
        if (typeof gtag === 'function') {
            gtag('event', name, {
                'event_category': 'GVM Calculator',
                'event_label': label,
                'value': value
            });
        }
    };

    /**
     * Logic to launch the calculator application
     */
    const launchCalculator = () => {
        const ui = {
            btn: document.querySelector(config.selectors.startBtn),
            intro: document.querySelector(config.selectors.intro),
            footer: document.querySelector(config.selectors.footerContent),
            container: document.querySelector(config.selectors.appContainer),
            iframe: document.querySelector(config.selectors.iframe),
            wrapper: document.querySelector(config.selectors.wrapper)
        };

        if (!ui.btn) return;

        trackEvent('start_calculator_clicked', 'Start Button');

        // Toggle Visibility
        if (ui.intro) ui.intro.style.display = "none";
        if (ui.footer) ui.footer.style.display = "none";
        ui.container.style.display = "block";
        ui.wrapper.classList.add('app-active');

        // Load Iframe
        ui.iframe.src = config.appUrl;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        ui.btn.textContent = "Loading...";
        ui.btn.disabled = true;
    };

    /**
     * Sets up all event listeners
     */
    const bindEvents = () => {
        const checkbox = document.querySelector(config.selectors.checkbox);
        const startBtn = document.querySelector(config.selectors.startBtn);
        const iframe = document.querySelector(config.selectors.iframe);
        const faqs = document.querySelectorAll(config.selectors.faqDetails);

        // Checkbox toggle logic
        if (checkbox && startBtn) {
            checkbox.addEventListener('change', (e) => {
                startBtn.disabled = !e.target.checked;
                if (e.target.checked) trackEvent('disclaimer_checked', 'Acknowledge');
            });
        }

        // Start button logic
        if (startBtn) {
            startBtn.addEventListener('click', launchCalculator);
        }

        // Iframe loader logic
        if (iframe) {
            iframe.addEventListener('load', () => {
                const loader = document.querySelector(config.selectors.loader);
                setTimeout(() => {
                    if (loader) loader.style.display = "none";
                    trackEvent('iframe_loaded', 'Calculator Ready');
                }, 800);
            });
        }

        // FAQ Tracking
        faqs.forEach(faq => {
            faq.addEventListener('toggle', () => {
                if (faq.open) {
                    const question = faq.querySelector('summary').textContent;
                    trackEvent('faq_opened', question);
                }
            });
        });
    };

    // --- 3. Public API (What the browser can access) ---
    return {
        init: function() {
            // Execute logic once DOM is ready
            initDynamicYear();
            bindEvents();
        }
    };

})();

// Initialize the app
document.addEventListener('DOMContentLoaded', GVMApp.init);
