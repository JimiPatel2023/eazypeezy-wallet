"use client";
import React from "react";
import { useWalletContext } from "../context/AppContext";
import { HiEllipsisVertical } from "react-icons/hi2";
import { toast } from "react-toastify";
import { SiEthereum, SiSolana } from "react-icons/si";
import { copy_text, format_public_key } from "@/lib/utils";
import { Copy, Plus } from "lucide-react";

const Wallets = () => {
	const { accounts, wallets, create_new_wallet } = useWalletContext();
	return (
		accounts &&
		wallets &&
		create_new_wallet && (
			<div className="">
				<div>
					<h1 className="text-2xl text-center">Wallets (Account {accounts.default_account + 1})</h1>
				</div>
				{
					<div className="pt-10 flex flex-col justify-center items-center gap-2 w-full p-10">
						{accounts.details[accounts.default_account].wallets.map((wallet, index) => {
							const found_wallet = wallets.find((val) => val.wallet_number === wallet);

							if (!found_wallet) {
								return null;
							}

							return (
								<div key={index} className={`p-3 bg-gray-800 rounded-lg hover:bg-gray-900 ${wallet === accounts.details[accounts.default_account].default_wallet ? "border-2 border-blue-500" : ""} w-full`}>
									<div className="flex justify-between pb-3 pl-1 items-center">
										<h1 className="text-2xl font-semibold">Wallet {wallet + 1}</h1>
										<div className="p-2 cursor-pointer hover:bg-gray-600 rounded-full">
											<HiEllipsisVertical size={26} />
										</div>
									</div>
									<div
										className="flex items-center justify-between gap-6 group cursor-pointer mb-3"
										onClick={(e) => {
											copy_text(found_wallet.sol_wallet.public_key);
											toast.info("Copied!", {
												position: "bottom-right",
												autoClose: 1500,
												hideProgressBar: true,
												closeOnClick: true,
												pauseOnHover: true,
												draggable: true,
												theme: "dark",
											});
										}}>
										<div className="flex items-center gap-2">
											<div className="p-2 bg-white rounded-lg">
												<SiSolana color="black" size={12} />
											</div>
											<p className="text-base">Solana</p>
										</div>
										<div className="flex items-center group-hover:text-gray-400">
											<p>{format_public_key(found_wallet.sol_wallet.public_key)}</p> <Copy size={16} />
										</div>
									</div>
									<div
										className="flex items-center justify-between gap-6 group cursor-pointer"
										onClick={(e) => {
											copy_text(found_wallet.eth_wallet.public_key);
											toast.info("Copied!", {
												position: "bottom-right",
												autoClose: 1500,
												hideProgressBar: true,
												closeOnClick: true,
												pauseOnHover: true,
												draggable: true,
												theme: "dark",
											});
										}}>
										<div className="flex items-center gap-2">
											<div className="p-2 bg-white rounded-lg">
												<SiEthereum color="black" size={12} />
											</div>
											<p className="text-base">Ethereum</p>
										</div>
										<div className="flex items-center group-hover:text-gray-400">
											<p>{format_public_key(found_wallet.eth_wallet.public_key)}</p> <Copy size={16} />
										</div>
									</div>
								</div>
							);
						})}
						<div
							className="flex justify-start text-start mt-3 items-center gap-2 text-xl font-semibold text-blue-500 p-2 cursor-pointer"
							onClick={ (e) => {
								create_new_wallet(Math.max(...accounts.details[accounts.default_account].wallets)+1);
							}}>
							<Plus />
							<h3>Add new wallet</h3>
						</div>
					</div>
				}
			</div>
		)
	);
};

export default Wallets;
