import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Summary } from "../../components/Summary";
import { SearchForm } from "./components/SearchForm";
import { TransactionsContainer, TransactionTable, PriceHighlight } from "./styles";

interface Transaction {
	id: number;
	description: string;
	type: 'income' | 'outcome';
	price: number;
	category: string;
	createdAt: string;
}

export function Transactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	
	async function loadTransactions() {
		const response = await fetch('http://localhost:3333/transactions');
		const data = await response.json();

		setTransactions(data);
	}

	useEffect(() => {
		loadTransactions();
	}, [])
	
	// useEffect(() => {
	// 	fetch('http://localhost:3333/transactions')
	// 		.then(response => response.json())
	// 		.then(data => {
	// 			console.log(data)
	// 		})
	// }, []);
	
	return (
		<div>
			<Header />
			<Summary />

			<TransactionsContainer>
				<SearchForm />
				<TransactionTable>
					<tbody>
						{transactions.map(transaction => {
							return (
								<tr key={transaction.id}>
									<td width="50%">{transaction.description}</td>
									<td>
										<PriceHighlight variant={transaction.type}>{transaction.price}</PriceHighlight>
									</td>
									<td>{transaction.category}</td>
									<td>{transaction.createdAt}</td>
								</tr>
							)
						})}
					</tbody>
				</TransactionTable>
			</TransactionsContainer>
		</div>
	)
}