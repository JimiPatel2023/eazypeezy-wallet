"use client";
import { copy_text, format_public_key } from "@/lib/utils";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, Copy, Github, Plus, Settings } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SiEthereum, SiSolana } from "react-icons/si";
import { toast } from "react-toastify";
import Link from "next/link";
import { useWalletContext } from "@/app/context/AppContext";
import { HiChevronDown, HiEllipsisVertical } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import CreateWallet from "./CreateWallet";

const Header = () => {
	const { accounts, change_default_account, wallets, create_new_wallet, change_default_wallet } = useWalletContext();
	const router = useRouter();
	return (
		accounts &&
		wallets && (
			<nav className="w-full px-0 flex justify-between items-center">
				<DropdownMenu dir="ltr" modal={false}>
					<DropdownMenuTrigger asChild>
						<Avatar className="cursor-pointer hover:bg-gray-800 select-none m-2">
							<AvatarFallback>A{accounts.default_account + 1}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<div className="flex flex-col justify-center items-center mt-2 mb-2 w-full">
							{accounts.details.map((element, index) => {
								return (
									<DropdownMenuItem
										className={`px-2 flex justify-around items-center gap-8 py-1 hover:bg-gray-800 cursor-pointer rounded-lg ${accounts.default_account === index ? "border-2 border-blue-500" : ""}`}
										key={index}
										onClick={(e) => {
											change_default_account(index);
										}}>
										<div className="flex justify-center items-center gap-3">
											<Avatar className="select-none text-xs">
												<AvatarFallback>A{index + 1}</AvatarFallback>
											</Avatar>
											<h4>Account {index + 1}</h4>
										</div>
										<div>
											<Check color="green" className={`${accounts.default_account === index ? "" : "invisible"}`} />
										</div>
									</DropdownMenuItem>
								);
							})}
						</div>
						<Link href={"/add-account"} className="px-2 flex gap-8 py-1 hover:bg-gray-800 cursor-pointer rounded-lg text-xs text-gray-400">
							<DropdownMenuItem>
								<Plus className="mr-3" /> Add Account
							</DropdownMenuItem>
						</Link>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="px-2 flex gap-8 py-1 hover:bg-gray-800 cursor-pointer rounded-lg text-lg">Settings</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="px-2 flex items-center gap-8 py-1 hover:bg-gray-800 cursor-pointer rounded-lg text-lg">Lock</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				{wallets && (
					<div className="flex justify-center items-center gap-2 text-lg rounded-full px-3 bg-gray-900 border-gray-500 border">
						<Settings className=" cursor-pointer" size={18} />

						<Sheet modal={false}>
							<SheetTrigger asChild className=" border-x border-gray-600">
								<div
									className="flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-800 px-2 py-1 select-none">
									<h3 className="text-base">{`Wallet ${accounts.details[accounts.default_account].default_wallet + 1}`}</h3>
									<HiChevronDown />
								</div>
							</SheetTrigger>
							<SheetContent side={"bottom"} className="h-screen overflow-y-scroll overflow-x-hidden">
								<SheetHeader className="mt-8">
									<SheetTitle>
										<h1 className="text-2xl text-center">Wallets (Account {accounts.default_account + 1})</h1>
									</SheetTitle>
								</SheetHeader>
								<div className="pt-10 flex flex-col justify-center items-center flex-wrap gap-2 w-full py-10">
									{accounts.details[accounts.default_account].wallets.map((wallet, index) => {
										const found_wallet = wallets.find((val) => val.wallet_number === wallet);

										if (!found_wallet) {
											return null;
										}

										return (
											<div key={index} className={`p-3 bg-gray-800 max-w-3xl rounded-lg cursor-pointer hover:bg-gray-900 ${wallet === accounts.details[accounts.default_account].default_wallet ? "border-2 border-blue-500" : ""} w-full`} onClick={(e) => {wallet !== accounts.details[accounts.default_account].default_wallet && change_default_wallet(wallet);}}>
												<div className="flex justify-between pb-3 pl-1 items-center">
													<h1 className="text-2xl font-semibold">Wallet {wallet + 1}</h1>
													<div className="p-2 cursor-pointer hover:bg-gray-600 rounded-full">
														<HiEllipsisVertical size={26} />
													</div>
												</div>
												<div
													className="flex items-center justify-between gap-6 group mb-3">
													<div className="flex items-center gap-2">
														<div className="p-2 bg-white rounded-lg">
															<SiSolana color="black" size={12} />
														</div>
														<p className="text-base">Solana</p>
													</div>
													<div className="flex items-center hover:text-gray-400" onClick={(e) => {
														copy_text(found_wallet.sol_wallet.public_key);
														toast.info("Copied!", {
															position: "top-right",
															autoClose: 5000,
															hideProgressBar: true,
															closeOnClick: true,
															pauseOnHover: true,
															draggable: true,
															theme: "dark",
														});
													}}>
														<p>{format_public_key(found_wallet.sol_wallet.public_key)}</p> <Copy size={16} />
													</div>
												</div>
												<div
													className="flex items-center justify-between gap-6 group">
													<div className="flex items-center gap-2">
														<div className="p-2 bg-white rounded-lg">
															<SiEthereum color="black" size={12} />
														</div>
														<p className="text-base">Ethereum</p>
													</div>
													<div className="flex items-center hover:text-gray-400" onClick={(e) => {
														copy_text(found_wallet.eth_wallet.public_key);
														toast.info("Copied!", {
															position: "top-right",
															autoClose: 5000,
															hideProgressBar: true,
															closeOnClick: true,
															pauseOnHover: true,
															draggable: true,
															theme: "dark",
														});
													}}>
														<p>{format_public_key(found_wallet.eth_wallet.public_key)}</p> <Copy size={16} />
													</div>
												</div>
											</div>
										);
									})}
									<div
										className="flex justify-start text-start mt-3 items-center gap-2 text-xl font-semibold text-blue-500 p-2 cursor-pointer"
										onClick={(e) => {
											create_new_wallet(Math.max(...accounts.details[accounts.default_account].wallets) + 1);
										}}>
										<Plus />
										<h3>Add new wallet</h3>
									</div>
								</div>
							</SheetContent>
						</Sheet>

						<DropdownMenu modal={false} >
							<DropdownMenuTrigger>
								<Copy className="cursor-pointer" size={18} />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="rounded-lg shadow-lg w-80">
								<DropdownMenuItem
									className="p-2 flex items-center justify-between gap-6 group cursor-pointer mb-1"
									onClick={(e) => {
										copy_text(wallets[accounts.details[accounts.default_account].default_wallet].sol_wallet.public_key);
										toast.info("Copied!", {
											position: "top-right",
											autoClose: 5000,
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
										<p>{format_public_key(wallets[accounts.details[accounts.default_account].default_wallet].sol_wallet.public_key)}</p> <Copy size={16} />
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="p-2 flex items-center justify-between gap-6 group cursor-pointer"
									onClick={(e) => {
										copy_text(wallets[accounts.details[accounts.default_account].default_wallet].eth_wallet.public_key);
										toast.info("Copied!", {
											position: "top-right",
											autoClose: 5000,
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
										<p>{format_public_key(wallets[accounts.details[accounts.default_account].default_wallet].eth_wallet.public_key)}</p> <Copy size={16} />
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}
				<div className="cursor-pointer rounded-full hover:bg-gray-800 p-2">
					<Github size={24} />
				</div>
			</nav>
		)
	);
};

export default Header;
