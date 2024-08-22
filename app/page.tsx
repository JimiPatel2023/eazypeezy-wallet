"use client";
import Header from "@/components/Header";
import { ArrowRightLeft, DollarSign, Plus, Send } from "lucide-react";
import { useWalletContext } from "./context/AppContext";
import { Oval } from "react-loader-spinner";
import { SiEthereum, SiSolana } from "react-icons/si";

export default function Home() {
	const button_data = [
		{
			Icon: Plus,
			text: "Receive",
		},
		{
			Icon: Send,
			text: "Send",
		},
		{
			Icon: ArrowRightLeft,
			text: "Swap",
		},
		{
			Icon: DollarSign,
			text: "Buy",
		},
	];

	const { accounts, wallets, wallet_balance } = useWalletContext();

	const sol_price = 144;
	const eth_price = 2630;

	return accounts !== null && wallets !== null ? (
		<div className="flex flex-col justify-center items-center p-1">
			<Header />
			<h1 className="text-4xl font-bold mt-8">$1400.34</h1>
			<p className="text-lg font-semibold text-green-400 mt-3">
				+$300.10 <span className="ml-1 p-1 bg-green-200/20 rounded-lg">+30%</span>
			</p>
			<div className="flex justify-center items-center gap-3 mt-8">
				{button_data.map((val) => {
					return (
						<div key={val.text} className="flex flex-col justify-center flex-wrap items-center gap-1 bg-gray-800 rounded-xl w-20 hover:bg-gray-700 cursor-pointer px-4 py-2">
							<val.Icon size={38} className="text-blue-400" />
							<p className="text-xs text-gray-300">{val.text}</p>
						</div>
					);
				})}
			</div>
			{
				(
					<div className="flex flex-col justify-center items-center gap-2 p-3 w-full max-w-3xl mt-5">
						<div className="flex justify-between items-center gap-1 w-full rounded-xl bg-gray-800 p-3 hover:bg-gray-800/70 cursor-pointer">
							<div className="flex justify-center items-center gap-3">
								<div className="rounded-full bg-white text-black p-3">
									<SiSolana size={22} />
								</div>
								<div className="flex flex-col justify-center items-start gap-1">
									<p className="text-lg font-semibold">Solana</p>
									<p className="text-gray-400">{wallet_balance ? wallet_balance.sol_balance : "-"} SOL</p>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center gap-1">
							<p className="text-lg font-semibold">${wallet_balance ? wallet_balance.sol_balance * sol_price : "-"}</p>
							<p className="text-gray-400">$0.00</p>
							</div>
						</div>
						<div className="flex justify-between items-center gap-1 w-full rounded-xl bg-gray-800 p-3 hover:bg-gray-800/70 cursor-pointer">
							<div className="flex justify-center items-center gap-3">
								<div className="rounded-full bg-white text-black p-3">
									<SiEthereum size={22} />
								</div>
								<div className="flex flex-col justify-center items-start gap-1">
									<p className="text-lg font-semibold">Ethereum</p>
									<p className="text-gray-400">{wallet_balance ? wallet_balance?.eth_balance : "-"} ETH</p>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center gap-1">
							<p className="text-lg font-semibold">${wallet_balance ? wallet_balance.eth_balance * eth_price : "-"}</p>
							<p className="text-gray-400">$0.00</p>
							</div>
						</div>
					</div>
				)
			}
		</div>
	) : (
		<div className="flex w-full justify-center items-center mt-20">
			<Oval visible={true} height="80" width="80" color="#4fa94d" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
		</div>
	);
}
