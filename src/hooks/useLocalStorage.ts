import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
	//lazy initializer - para fazer a chamada apenas uma vez
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);

			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.warn(`useLocalStorage: erro ao ler chave "${key}"`, error);
			return initialValue;
		}
	});

	//substitui o setState padrão - ele atualiza o react e salva no storage
	const setValue = (value: T | ((val: T) => T)) => {
		// Functional update garante que 'prev' é sempre o estado mais recente,
		// mesmo com múltiplas chamadas em sequência dentro do mesmo act().
		// Sem isso, value(storedValue) usaria um closure desatualizado.
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
