import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../hooks/useLocalStorage";

describe("useLocalStorage", () => {
	it("deve retornar o valor inicial quando o storage está vazio", () => {
		const { result } = renderHook(() =>
			useLocalStorage("test-key", "valor inicial"),
		);
		expect(result.current[0]).toBe("valor inicial");
	});

	it("deve salvar e recuperar valores do storage", () => {
		const { result } = renderHook(() => useLocalStorage<number>("test-key", 0));

		act(() => {
			result.current[1](42);
		});

		expect(result.current[0]).toBe(42);
		expect(localStorage.getItem("test-key")).toBe("42");
	});

	it("deve recuperar valor existente do storage na inicialização", () => {
		localStorage.setItem("test-key", JSON.stringify("valor salvo"));

		const { result } = renderHook(() =>
			useLocalStorage("test-key", "valor inicial"),
		);

		expect(result.current[0]).toBe("valor salvo");
	});

	it("deve suportar functional update", () => {
		const { result } = renderHook(() =>
			useLocalStorage<number[]>("test-key", []),
		);

		act(() => {
			result.current[1]((prev) => [...prev, 1]);
		});
		act(() => {
			result.current[1]((prev) => [...prev, 2]);
		});

		expect(result.current[0]).toEqual([1, 2]);
	});

	it("deve retornar valor inicial se o storage contiver JSON inválido", () => {
		localStorage.setItem("test-key", "isso não é json válido{{{");

		const { result } = renderHook(() =>
			useLocalStorage("test-key", "fallback"),
		);

		expect(result.current[0]).toBe("fallback");
	});
});
