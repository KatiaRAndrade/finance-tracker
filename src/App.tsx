import { useState } from "react";
import { TransactionProvider } from "./context/TransactionContext";
import { AppShell } from "./components/AppShell";
import { PageHeader, ActionButton } from "./components/PageHeader";
import { DashboardContainer } from "./features/dashboard/DashboardContainer";
import { FilteredTransactionContainer } from "./features/transactions/FilteredTransactionContainer";
import { TransactionModal } from "./features/transactions/TransactionModal";

type ActiveNav = "overview" | "transactions";

const PAGE_TITLES: Record<ActiveNav, string> = {
	overview: "Visão Geral",
	transactions: "Transações",
};

export default function App() {
	const [activeNav, setActiveNav] = useState<ActiveNav>("overview");
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<TransactionProvider>
			<AppShell activeNav={activeNav} onNavChange={setActiveNav}>
				<PageHeader
					title={PAGE_TITLES[activeNav]}
					subtitle="Maio 2026"
					action={
						<ActionButton
							label="Registrar"
							onClick={() => setIsModalOpen(true)}
						/>
					}
				/>

				{activeNav === "overview" && <DashboardContainer />}
				{activeNav === "transactions" && <FilteredTransactionContainer />}
			</AppShell>

			<TransactionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</TransactionProvider>
	);
}
