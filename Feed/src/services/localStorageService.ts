// src/services/localStorageService.ts

const localStorageService = {
    setItem: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getItem: <T>(key: string): T | string | null => {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            return JSON.parse(item) as T;
        } catch {
            return item; // fallback to raw string
        }
    },

    removeItem: (key: string) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    }
};
export default localStorageService;
