import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ArrowCircleUp, ArrowCircleDown } from 'phosphor-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { api } from '../../lib/axios';
import { Overlay, Content, CloseButton, TransactionType, TransactionTypeButton } from './styles';

const newTransactionFormSchema = z.object({
	description: z.string(),
	price: z.number(),
	category: z.string(),
	type: z.enum(['income', 'outcome'])	
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
	const { 
		control,
		register, 
		handleSubmit, 
		formState: { isSubmitting } 
	} = useForm<NewTransactionFormInputs>({
		resolver: zodResolver(newTransactionFormSchema),
		defaultValues: {
			type: 'income'
		}
	})

	async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
		const { description, price, category, type } = data
		
		await api.post('transactions', {
			description,
			price,
			category,
			type,
			createdAt: new Date()
		})
		
		//It works, but it's kind of unclear what's being sent to the api
		// await api.post('transactions', {
		// 	...data
		// })
	}
	
	return (
		<Dialog.Portal>
			<Overlay />
			
			<Content>
				<Dialog.Title>Nova transação</Dialog.Title>

				<CloseButton>
					<X size={24}/>	
				</CloseButton>

				<form onSubmit={handleSubmit(handleCreateNewTransaction)}>
					<input 
						type="text" 
						placeholder='Descrição' 
						required 
						{...register('description')}
					/>
					<input 
						type="number" 
						placeholder='Preço' 
						required 
						{...register('price', { valueAsNumber: true })}
					/>
					<input 
						type="text" 
						placeholder='Categoria'
						required 
						{...register('category')}
					/>

					<Controller 
						control={control}
						name="type"
						render={( { field } ) => {
							return (
							<TransactionType 
								onValueChange={field.onChange} 
								value={field.value}
							>
								<TransactionTypeButton value="income" variant='income'>
									<ArrowCircleUp size={24} />
									Entrada
								</TransactionTypeButton>
								<TransactionTypeButton value="outcome" variant='outcome'>
									<ArrowCircleDown size={24} />
									Saída
								</TransactionTypeButton>
							</TransactionType>
							)
						}}
					/>

					<button type="submit" disabled={isSubmitting}>Cadastrar</button>
				</form>
			</Content>
		</Dialog.Portal>
	)
}