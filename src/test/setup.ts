import "@testing-library/jest-dom";
// jest-dom adiciona matchers como toBeInTheDocument(), toHaveTextContent(), etc.
// Sem isso, só teríamos os matchers básicos do Vitest.

// Mock do localStorage — o jsdom tem uma implementação limitada.
// Criamos um mock completo que se comporta como o localStorage real.
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] ?? null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		// Limpa o store entre testes — cada teste começa do zero.
		clear: () => {
			store = {};
		},
	};
})();
// (() => {})() é uma IIFE (Immediately Invoked Function Expression).
// Criamos uma closure com 'store' privado — ninguém acessa diretamente.

// configurable: true permite redefinir a propriedade no modo watch do Vitest.
Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
	configurable: true,
	writable: true,
});

// Limpa o localStorage antes de cada teste.
// Sem isso, um teste que salva dados contaminaria o próximo.
beforeEach(() => {
	localStorage.clear();
});
