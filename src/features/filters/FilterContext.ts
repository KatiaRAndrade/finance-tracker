import { createContext, useContext } from "react";
import type { FilterContextType } from "./filter.types";

export const FilterContext = createContext<FilterContextType | null>(null);

export function useFilterContext() {
	const context = useContext(FilterContext);

	if (!context) {
		throw new Error(
			"Subcomponentes de Filter devem ser usados dentro de <Filter>",
		);
	}

	return context;
}
