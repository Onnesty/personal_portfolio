import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

// Change this to 'light' to switch the default for first-time visitors.
export const DefaultTheme: Theme = 'dark';
const ThemeStorageKey = 'portfolio-theme';

export function GetTheme(): Theme {
    try {
        const SavedTheme = localStorage.getItem(ThemeStorageKey);
        if (SavedTheme === 'dark' || SavedTheme === 'light') return SavedTheme;
    } catch {
        // The toggle still works when browser storage is unavailable.
    }
    return DefaultTheme;
}

export function ApplyTheme(CurrentTheme: Theme) {
    document.documentElement.dataset.theme = CurrentTheme;
    window.dispatchEvent(new Event('themechange'));
}

function SubscribeTheme(OnChange: () => void) {
    window.addEventListener('themechange', OnChange);
    return () => window.removeEventListener('themechange', OnChange);
}

function GetActiveTheme(): Theme {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function useTheme(): Theme {
    return useSyncExternalStore(SubscribeTheme, GetActiveTheme, () => DefaultTheme);
}

export function SaveTheme(CurrentTheme: Theme) {
    ApplyTheme(CurrentTheme);
    try {
        localStorage.setItem(ThemeStorageKey, CurrentTheme);
    } catch {
        // Keep the selected theme for this visit even if it cannot be saved.
    }
}
