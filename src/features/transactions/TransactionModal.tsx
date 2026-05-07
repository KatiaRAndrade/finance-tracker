import { useState } from "react";
import { createPortal } from "react-dom";
import type { FormEvent } from "react";
import { useTransactionContext } from "../../context/TransactionContext";
import { CATEGORIES } from "./transaction.types";
import type { Category, NewTransaction } from "./transaction.types";

interface TransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const getToday = () => new Date().toISOString().slice(0, 10);

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
	const { add } = useTransactionContext();

	const [type, setType] = useState<"income" | "expense">("expense");
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState<Category>("other");
	const [date, setDate] = useState(getToday);

	function resetForm() {
		setDescription("");
		setAmount("");
		setType("expense");
		setCategory("other");
		setDate(getToday());
	}

	function handleClose() {
		resetForm();
		onClose();
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const numAmount = parseFloat(amount);
		if (!description.trim() || isNaN(numAmount) || numAmount <= 0) return;

		add({
			description: description.trim(),
			amount: numAmount,
			type,
			category,
			date,
		} satisfies NewTransaction);
		resetForm();
		onClose();
	}

	if (!isOpen) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75"
			onClick={handleClose}
		>
			<div
				className="w-full max-w-md rounded-2xl p-8 bg-card border-[0.5px] border-white/8"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between mb-6">
					<h2 className="font-display italic font-medium text-[1.75rem]">
						Nova transação
					</h2>
					<button
						type="button"
						onClick={handleClose}
						className="text-white/40 hover:text-white/80 transition-colors text-2xl leading-none"
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex rounded-xl overflow-hidden border-[0.5px] border-white/10">
						<button
							type="button"
							onClick={() => setType("expense")}
							className={`flex-1 py-2.5 text-[11px] uppercase tracking-editorial transition-all ${
								type === "expense"
									? "bg-coral/[0.15] text-coral-light"
									: "text-white/40"
							}`}
						>
							Despesa
						</button>
						<button
							type="button"
							onClick={() => setType("income")}
							className={`flex-1 py-2.5 text-[11px] uppercase tracking-editorial transition-all ${
								type === "income"
									? "bg-income/[0.12] text-income"
									: "text-white/40"
							}`}
						>
							Receita
						</button>
					</div>

					<div>
						<label className="block text-[11px] uppercase text-white/45 mb-1.5 tracking-editorial">
							Descrição
						</label>
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Ex: Almoço, Salário..."
							required
							className="w-full bg-transparent rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none border-[0.5px] border-white/10"
						/>
					</div>

					<div>
						<label className="block text-[11px] uppercase text-white/45 mb-1.5 tracking-editorial">
							Valor (R$)
						</label>
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0,00"
							min="0.01"
							step="0.01"
							required
							className="w-full bg-transparent rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none border-[0.5px] border-white/10"
						/>
					</div>

					<div className="flex gap-3">
						<div className="flex-1">
							<label className="block text-[11px] uppercase text-white/45 mb-1.5 tracking-editorial">
								Categoria
							</label>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value as Category)}
								className="w-full bg-input rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none border-[0.5px] border-white/10"
							>
								{Object.entries(CATEGORIES).map(([key, { label }]) => (
									<option key={key} value={key}>
										{label}
									</option>
								))}
							</select>
						</div>
						<div className="flex-1">
							<label className="block text-[11px] uppercase text-white/45 mb-1.5 tracking-editorial">
								Data
							</label>
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								required
								className="w-full bg-transparent rounded-xl px-4 py-3 text-sm text-white outline-none border-[0.5px] border-white/10"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="mt-2 w-full py-3.5 rounded-xl text-[11px] uppercase font-semibold tracking-editorial text-bg hover:opacity-90 transition-opacity"
						style={{ background: "linear-gradient(90deg, #e8919c, #f0a989)" }}
					>
						Registrar
					</button>
				</form>
			</div>
		</div>,
		document.body,
	);
}
