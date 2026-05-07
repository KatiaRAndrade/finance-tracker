import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);

			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.warn(`useLocalStorage: erro ao ler chave "${key}"`, error);
			return initialValue;
		}
	});

	const setValue = (value: T | ((val: T) => T)) => {
		setStoredValue((prev) => {
			try {
				const valueToStore = value instanceof Function ? value(prev) : value;
				localStorage.setItem(key, JSON.stringify(valueToStore));
				return valueToStore;
			} catch (error) {
				console.warn(`useLocalStorage: erro ao salvar chave "${key}"`, error);
				return prev;
			}
		});
	};

	return [storedValue, setValue] as const;
}
