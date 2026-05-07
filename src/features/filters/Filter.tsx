import type { ReactNode } from "react";
import { FilterContext } from "./FilterContext";
import {
	FilterPeriod,
	FilterCategory,
	FilterType,
	FilterReset,
} from "./FilterSubcomponents";
import type { FilterContextType } from "./filter.types";

interface FilterProps {
	children: ReactNode;
	value: FilterContextType;
}

// eslint-disable-next-line react-refresh/only-export-components
function FilterRoot({ children, value }: FilterProps) {
	return (
		<FilterContext.Provider value={value}>
			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</FilterContext.Provider>
	);
}

export const Filter = Object.assign(FilterRoot, {
	Period: FilterPeriod,
	Category: FilterCategory,
	Type: FilterType,
	Reset: FilterReset,
});
