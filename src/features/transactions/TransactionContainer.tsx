import { useTransactionContext } from "../../context/TransactionContext";
import { TransactionList } from "./TransactionList";

export function TransactionContainer() {
	const { transactions, remove } = useTransactionContext();

	return <TransactionList items={transactions} onDelete={remove} />;
}
