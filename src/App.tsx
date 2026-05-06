import { TransactionProvider } from "./context/TransactionContext";
import { AppShell } from "./components/AppShell";
import { PageHeader, ActionButton } from "./components/PageHeader";
import { DashboardContainer } from "./features/dashboard/DashboardContainer";

// Exemplo de composição da página "Visão Geral" no novo visual.
// O AppShell e PageHeader são reaproveitáveis em todas as páginas.

export default function App() {
	return (
		<TransactionProvider>
			<AppShell activeNav="overview">
				<PageHeader
					title="Visão Geral"
					subtitle="Maio 2026"
					action={<ActionButton label="Registrar" />}
				/>

				{/* DashboardContainer continua igual — ele orquestra os dados.
            Por dentro, ele usa SummaryCards e os gráficos, que já têm
            o novo visual aplicado. Nenhuma mudança de arquitetura. */}
				<DashboardContainer />
			</AppShell>
		</TransactionProvider>
	);
}
