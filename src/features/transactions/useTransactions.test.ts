import { renderHook, act } from "@testing-library/react";
import { useTransactions } from "./useTransactions";
import type { NewTransaction } from "./transaction.types";

const mockTransaction: NewTransaction = {
	description: "Mercado",
	amount: 150,
	category: "food",
	type: "expense",
	date: "2026-04-15",
};

const mockIncome: NewTransaction = {
	description: "Salário",
	amount: 5000,
	category: "income",
	type: "income",
	date: "2026-04-10",
};

describe("useTransactions", () => {
	describe("add", () => {
		it("deve adicionar uma transação com id gerado automaticamente", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add(mockTransaction);
			});

			expect(result.current.transactions).toHaveLength(1);

			const added = result.current.transactions[0];
			expect(added.description).toBe("Mercado");
			expect(added.amount).toBe(150);
			expect(added.id).toBeDefined();
			expect(typeof added.id).toBe("string");
		});

		it("deve adicionar múltiplas transações sem perder nenhuma", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add(mockTransaction);
				result.current.add(mockIncome);
			});
			expect(result.current.transactions).toHaveLength(2);
		});
	});

	describe("remove", () => {
		it("deve remover a transação pelo id", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add(mockTransaction);
			});

			const id = result.current.transactions[0].id;

			act(() => {
				result.current.remove(id);
			});

			expect(result.current.transactions).toHaveLength(0);
		});

		it("não deve afetar outras transações ao remover uma", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add(mockTransaction);
				result.current.add(mockIncome);
			});

			const idToRemove = result.current.transactions[0].id;

			act(() => {
				result.current.remove(idToRemove);
			});

			expect(result.current.transactions).toHaveLength(1);
			expect(result.current.transactions[0].id).not.toBe(idToRemove);
		});
	});

	describe("update", () => {
		it("deve atualizar parcialmente uma transação", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add(mockTransaction);
			});

			const id = result.current.transactions[0].id;

			act(() => {
				result.current.update(id, { description: "Mercado Novo", amount: 200 });
			});

			const updated = result.current.transactions[0];
			expect(updated.description).toBe("Mercado Novo");
			expect(updated.amount).toBe(200);
			expect(updated.category).toBe("food");
			expect(updated.type).toBe("expense");
		});
	});

	describe("summary", () => {
		it("deve calcular saldo, receitas e despesas corretamente", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add(mockIncome);
				result.current.add(mockTransaction);
			});

			const { summary } = result.current;
			expect(summary.totalIncome).toBe(5000);
			expect(summary.totalExpenses).toBe(150);
			expect(summary.balance).toBe(4850);
		});

		it("deve retornar saldo zero quando não há transações", () => {
			const { result } = renderHook(() => useTransactions());

			expect(result.current.summary.balance).toBe(0);
			expect(result.current.summary.totalIncome).toBe(0);
			expect(result.current.summary.totalExpenses).toBe(0);
		});

		it("deve retornar saldo negativo quando despesas superam receitas", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add({ ...mockTransaction, amount: 1000 });
				result.current.add({ ...mockIncome, amount: 500 });
			});

			expect(result.current.summary.balance).toBe(-500);
		});
	});

	describe("ordenação", () => {
		it("deve retornar transações ordenadas da mais recente pra mais antiga", () => {
			const { result } = renderHook(() => useTransactions());

			act(() => {
				result.current.add({ ...mockTransaction, date: "2026-01-01" });
				result.current.add({ ...mockTransaction, date: "2026-03-01" });
				result.current.add({ ...mockTransaction, date: "2026-02-01" });
			});

			const dates = result.current.transactions.map((t) => t.date);
			expect(dates[0]).toBe("2026-03-01");
			expect(dates[1]).toBe("2026-02-01");
			expect(dates[2]).toBe("2026-01-01");
		});
	});
});
