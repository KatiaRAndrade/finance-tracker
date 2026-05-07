import { CATEGORIES } from "../transactions/transaction.types";
import { useFilterContext } from "./FilterContext";

const selectClass =
	"bg-input border-[0.5px] border-white/10 rounded-[10px] px-3.5 py-2 text-xs text-white/65 outline-none tracking-[0.02em]";

export function FilterPeriod() {
	const { filters, setFilter } = useFilterContext();

	const months = Array.from({ length: 12 }, (_, i) => {
		const date = new Date();
		date.setMonth(date.getMonth() - i);
		return {
			label: new Intl.DateTimeFormat("pt-BR", {
				month: "long",
				year: "numeric",
			}).format(date),
			month: date.getMonth(),
			year: date.getFullYear(),
		};
	});

	const currentValue = filters.period
		? `${filters.period.month}-${filters.period.year}`
		: "";

	return (
		<select
			value={currentValue}
			onChange={(e) => {
				if (!e.target.value) {
					setFilter("period", undefined);
					return;
				}
				const [month, year] = e.target.value.split("-").map(Number);
				setFilter("period", { month, year });
			}}
			className={selectClass}
		>
			<option value="">Todos os meses</option>
			{months.map(({ label, month, year }) => (
				<option key={`${month}-${year}`} value={`${month}-${year}`}>
					{label}
				</option>
			))}
		</select>
	);
}

export function FilterCategory() {
	const { filters, setFilter } = useFilterContext();

	return (
		<select
			value={filters.category ?? ""}
			onChange={(e) => {
				const value = e.target.value;
				setFilter(
					"category",
					value ? (value as keyof typeof CATEGORIES) : undefined,
				);
			}}
			className={selectClass}
		>
			<option value="">Todas as categorias</option>
			{Object.entries(CATEGORIES).map(([key, { label }]) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
}

export function FilterType() {
	const { filters, setFilter } = useFilterContext();

	const options = [
		{ value: "", label: "Todos", activeClass: "bg-white/8 text-white" },
		{
			value: "income",
			label: "Receitas",
			activeClass: "bg-income/[0.12] text-income",
		},
		{
			value: "expense",
			label: "Despesas",
			activeClass: "bg-coral/[0.15] text-coral-light",
		},
	] as const;

	return (
		<div className="flex gap-0.5 p-[3px] bg-white/[0.04] border-[0.5px] border-white/8 rounded-[10px]">
			{options.map((option) => {
				const isActive = (filters.type ?? "") === option.value;
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => setFilter("type", option.value || undefined)}
						className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer tracking-[0.08em] ${
							isActive ? option.activeClass : "text-white/35"
						}`}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}

export function FilterReset() {
	const { reset, filters } = useFilterContext();

	if (Object.keys(filters).length === 0) return null;

	return (
		<button
			type="button"
			onClick={reset}
			className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/60 transition-colors px-2 py-1.5 tracking-[0.04em]"
		>
			<svg
				width="11"
				height="11"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
			Limpar
		</button>
	);
}
