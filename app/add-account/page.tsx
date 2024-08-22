"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accounts, generate_mnemonic_phrase, get_words_from_SRP } from "@/lib/utils";
import WordGridCard from "@/components/RecoveryPhraseBox";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../context/AppContext";

// #3061a2
const AddAccountPage = () => {
	const [SRP, setSRP] = useState<null | string>(null);
	const [words, setWords] = useState<null | string[]>(null);
	const [saved, setSaved] = useState<boolean>(false);

	const {create_new_account} = useWalletContext()

	const handleCreateWallet = () => {
		const temp = generate_mnemonic_phrase();
		setSRP(temp);
		setWords(get_words_from_SRP(temp));
	};

	const handleWalletCreation = () => {
		if(SRP) {
			create_new_account(SRP)
		}
	};

	return !SRP || !words ? (
		<div className="flex flex-col items-center w-full pt-16 justify-between gap-40">
			<div className="flex flex-col gap-10 items-center justify-center w-full">
				<Image src={"/assets/images/logo.jpg"} alt="EazyPeezy Logo" height={80} width={80} className="rounded-full" />
				<div className="flex flex-col justify-center items-center gap-3 text-center">
					<h1 className="font-bold text-4xl text-gray-200">
						Welcome to <span className="text-[#3061a2]">EazyPeezy</span> Wallet
					</h1>
					<p>Lets create a new account...</p>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center gap-5">
				<Button
					onClick={(e) => {
						handleCreateWallet();
					}}
					variant="default"
					className="font-semibold text-lg p-6 px-10 max-w-xl min-w-full">
					Create a new wallet
				</Button>
				<Button variant="secondary" className="font-semibold text-lg p-6 px-10 max-w-xl min-w-full">
					Import Wallet
				</Button>
			</div>
		</div>
	) : (
		<div className="flex flex-col items-center w-full pt-20 justify-between gap-10">
			<div className="flex flex-col justify-center items-center gap-5">
				<h1 className="font-bold text-4xl text-white">Secret Recovery Phrase</h1>
				<p className="text-gray-300">Save these words in a safe place.</p>
			</div>
			<WordGridCard words={words} whole_string={SRP} />
			<div className="flex items-center space-x-2">
				<Checkbox id="terms" checked={saved} onCheckedChange={() => setSaved((val) => !val)} />
				<label htmlFor="terms" className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					I saved my recovery phrase
				</label>
			</div>
			<Button
				variant="default"
				disabled={!saved}
				onClick={(e) => {
					handleWalletCreation();
				}}
				className="font-semibold text-lg p-6 px-20">
				Create Wallet
			</Button>
		</div>
	);
};

export default AddAccountPage;
