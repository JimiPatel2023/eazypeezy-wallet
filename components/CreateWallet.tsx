"use server"
import { Plus } from "lucide-react";
import React from "react";

const CreateWallet = ({wallet_number, create_new_wallet}: {wallet_number:number ,create_new_wallet:(wallet_number: number) => Promise<void> | null}) => {
	return (
		<div
			className="flex justify-start text-start mt-3 items-center gap-2 text-xl font-semibold text-blue-500 p-2 cursor-pointer"
			onClick={async (e) => {
				await create_new_wallet(wallet_number);
			}}>
			<Plus />
			<h3>Add new wallet</h3>
		</div>
	);
};

export default CreateWallet;
 