import { renderHook } from "@testing-library/react";
import { useChartData } from "./useChartData";
import type { Transaction } from "../transactions/transaction.types";

const mockTransactions: Transaction[] = [
	{
		id: "1",
		description: "Salário",
		amount: 5000,
		category: "income",
		type: "income",
		date: "2026-04-10",
	},
	{
		id: "2",
		description: "Mercado",
		amount: 500,
		category: "food",
		type: "expense",
		date: "2026-04-15",
	},
	{
		id: "3",
		description: "Aluguel",
		amount: 1500,
		category: "utilities",
		type: "expense",
		date: "2026-04-05",
	},
	{
		id: "4",
		description: "Salário",
		amount: 5000,
		category: "income",
		type: "income",
		date: "2026-03-10",
	},
	{
		id: "5",
		description: "Mercado",
		amount: 400,
		category: "food",
		type: "expense",
		date: "2026-03-20",
	},
];

describe("useChartData", () => {
	describe("monthlyData", () => {
		it("deve agrupar transações por mês corretamente", () => {
			const { result } = renderHook(() => useChartData(mockTransactions));

			expect(result.current.monthlyData).toHaveLength(2);
		});

		it("deve ordenar os meses cronologicamente", () => {
			const { result } = renderHook(() => useChartData(mockTransactions));

			const months = result.current.monthlyData.map((d) => d.month);
			expect(months[0]).toMatch(/mar/i);
			expect(months[1]).toMatch(/abr/i);
		});

		it("deve somar receitas e despesas de cada mês", () => {
			const { result } = renderHook(() => useChartData(mockTransactions));
			const abril = result.current.monthlyData[1];
			expect(abril.income).toBe(5000);
			expect(abril.expenses).toBe(2000);
			expect(abril.balance).toBe(3000);
		});
	});

	describe("categoryData", () => {
		it("deve incluir apenas despesas na distribuição por categoria", () => {
			const { result } = renderHook(() => useChartData(mockTransactions));

			const categoryNames = result.current.categoryData.map((d) => d.name);
			expect(categoryNames).not.toContain("Receita");
		});

		it("deve calcular percentuais que somam 100%", () => {
			const { result } = renderHook(() => useChartData(mockTransactions));

			const total = result.current.categoryData.reduce(
				(acc, d) => acc + d.percentage,
				0,
			);
			expect(total).toBeCloseTo(100, 0);
		});

		it("deve ordenar categorias do maior para o menor valor", () => {
			const { result } = renderHook(() => useChartData(mockTransactions));

			const values = result.current.categoryData.map((d) => d.value);
			for (let i = 0; i < values.length - 1; i++) {
				expect(values[i]).toBeGreaterThanOrEqual(values[i + 1]);
			}
		});
	});

	describe("recentSummary", () => {
		it("deve retornar zeros quando não há transações recentes", () => {
			const old: Transaction[] = [
				{
					id: "99",
					description: "Antiga",
					amount: 100,
					category: "food",
					type: "expense",
					date: "2020-01-01",
				},
			];

			const { result } = renderHook(() => useChartData(old));

			expect(result.current.recentSummary.income).toBe(0);
			expect(result.current.recentSummary.expenses).toBe(0);
			expect(result.current.recentSummary.savingsRate).toBe(0);
		});
	});

	it("deve retornar arrays vazios sem transações", () => {
		const { result } = renderHook(() => useChartData([]));

		expect(result.current.monthlyData).toHaveLength(0);
		expect(result.current.categoryData).toHaveLength(0);
	});
});
