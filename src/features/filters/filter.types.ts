import type { Category } from "../transactions/transaction.types";

export interface FilterState {
	category?: Category;
	period?: { month: number; year: number };
	type?: "income" | "expense";
}

export interface FilterContextType {
	filters: FilterState;
	setFilter: <K extends keyof FilterState>(
		key: K,
		value: FilterState[K],
	) => void;
	reset: () => void;
}
