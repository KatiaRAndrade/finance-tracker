import { useState, useMemo } from "react";
import type { Transaction } from "../transactions/transaction.types";
import type { FilterState } from "./filter.types";

const INITIAL_FILTERS: FilterState = {};

export function useFilters(transactions: Transaction[]) {
	const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

	const setFilter = <K extends keyof FilterState>(
		key: K,
		value: FilterState[K],
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const reset = () => setFilters(INITIAL_FILTERS);

	const filtered = useMemo(() => {
		return transactions.filter((transaction) => {
			if (filters.type && transaction.type !== filters.type) return false;
			if (filters.category && transaction.category !== filters.category)
				return false;

			if (filters.period) {
				const date = new Date(transaction.date);
				if (date.getMonth() !== filters.period.month) return false;
				if (date.getFullYear() !== filters.period.year) return false;
			}

			return true;
		});
	}, [transactions, filters]);

	const hasActiveFilters = Object.keys(filters).length > 0;

	return { filters, setFilter, reset, filtered, hasActiveFilters };
}
