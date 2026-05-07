import { render, screen, fireEvent } from "@testing-library/react";
import { TransactionList } from "./TransactionList";
import type { Transaction } from "./transaction.types";

const mockItems: Transaction[] = [
	{
		id: "1",
		description: "Mercado Extra",
		amount: 187.4,
		category: "food",
		type: "expense",
		date: "2026-04-14",
	},
	{
		id: "2",
		description: "Salário",
		amount: 4800,
		category: "income",
		type: "income",
		date: "2026-04-10",
	},
];

describe("TransactionList", () => {
	it("deve renderizar todas as transações", () => {
		render(<TransactionList items={mockItems} onDelete={vi.fn()} />);
		expect(screen.getByText("Mercado Extra")).toBeInTheDocument();
		expect(screen.getByText("Salário")).toBeInTheDocument();
	});

	it("deve renderizar estado vazio quando não há transações", () => {
		render(<TransactionList items={[]} onDelete={vi.fn()} />);

		expect(screen.getByText("Nenhuma transação ainda")).toBeInTheDocument();
	});

	it("deve chamar onDelete com o id correto ao clicar em deletar", () => {
		const onDelete = vi.fn();

		render(<TransactionList items={mockItems} onDelete={onDelete} />);

		const deleteButtons = screen.getAllByRole("button", {
			name: /deletar transação/i,
		});

		fireEvent.click(deleteButtons[0]);

		expect(onDelete).toHaveBeenCalledWith("1");
		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("deve exibir valores positivos para receitas e negativos para despesas", () => {
		render(<TransactionList items={mockItems} onDelete={vi.fn()} />);

		expect(screen.getAllByText(/\+/).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/[−–]/).length).toBeGreaterThan(0);
	});

	it("deve exibir o badge de categoria correto", () => {
		render(<TransactionList items={mockItems} onDelete={vi.fn()} />);

		expect(screen.getByText(/^Alimentação/)).toBeInTheDocument();
		expect(screen.getByText(/^Entradas/)).toBeInTheDocument();
	});
});
