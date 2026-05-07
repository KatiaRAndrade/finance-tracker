import { useMemo } from "react";
import { CATEGORIES } from "../transactions/transaction.types";
import type { Transaction } from "../transactions/transaction.types";

export interface MonthlyDataPoint {
	month: string;
	income: number;
	expenses: number;
	balance: number;
}

export interface CategoryDataPoint {
	name: string;
	value: number;
	color: string;
	percentage: number;
}

const CATEGORY_COLORS: Record<string, string> = {
	food: "#fbbf24",
	housing: "#22d3ee",
	transport: "#86efac",
	health: "#f87171",
	leisure: "#a78bfa",
	income: "#34d399",
};

export function useChartData(transactions: Transaction[]) {
	const monthlyData = useMemo((): MonthlyDataPoint[] => {
		const monthMap = new Map<string, MonthlyDataPoint>();

		transactions.forEach((t) => {
			const date = new Date(t.date);
			const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;

			const label = new Intl.DateTimeFormat("pt-BR", { month: "short" })
				.format(date)
				.replace(".", "")
				.replace(/^\w/, (c) => c.toUpperCase());

			if (!monthMap.has(key)) {
				monthMap.set(key, { month: label, income: 0, expenses: 0, balance: 0 });
			}

			const entry = monthMap.get(key)!;

			if (t.type === "income") {
				entry.income += t.amount;
			} else {
				entry.expenses += t.amount;
			}

			entry.balance = entry.income - entry.expenses;
		});

		return Array.from(monthMap.entries())
			.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
			.map(([, data]) => data);
	}, [transactions]);

	const categoryData = useMemo((): CategoryDataPoint[] => {
		const expenses = transactions.filter((t) => t.type === "expense");

		const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);

		const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
			acc[t.category] = (acc[t.category] ?? 0) + t.amount;
			return acc;
		}, {});

		return Object.entries(grouped)
			.map(([category, value]) => ({
				name: CATEGORIES[category as keyof typeof CATEGORIES].label,
				value,
				color: CATEGORY_COLORS[category] ?? "#888",
				percentage:
					totalExpenses > 0
						? Math.round((value / totalExpenses) * 1000) / 10
						: 0,
			}))
			.sort((a, b) => b.value - a.value);
	}, [transactions]);

	const recentSummary = useMemo(() => {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recent = transactions.filter(
			(t) => new Date(t.date) >= thirtyDaysAgo,
		);

		const income = recent
			.filter((t) => t.type === "income")
			.reduce((acc, t) => acc + t.amount, 0);

		const expenses = recent
			.filter((t) => t.type === "expense")
			.reduce((acc, t) => acc + t.amount, 0);

		const savingsRate =
			income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

		return { income, expenses, balance: income - expenses, savingsRate };
	}, [transactions]);

	return { monthlyData, categoryData, recentSummary };
}
