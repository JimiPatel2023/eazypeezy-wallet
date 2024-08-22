"use client";
import React, { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HiEllipsisVertical } from "react-icons/hi2";
import { ArrowLeft, ChevronRight, Copy } from "lucide-react";
import { useWalletContext } from "@/app/context/AppContext";
import { SiEthereum, SiSolana } from "react-icons/si";
import { copy_text, format_public_key } from "@/lib/utils";
import { toast } from "react-toastify";
import ShowPrivateKeys from "./ShowPrivateKeys";
import RemoveWallet from "./RemoveWallet";

const WalletSettingsSheet = ({ wallet_number }: { wallet_number: number }) => {
	const { wallets } = useWalletContext();

    const found_wallet = wallets!.find((val) => val.wallet_number === wallet_number); 
    const [close, set_close] = useState<boolean>(false);

    useEffect(() => {
            set_close(true)
    }, [])

	return (
		wallets && <Sheet modal={false} onOpenChange={open=>set_close(!open)}>
			<SheetTrigger className="p-2 cursor-pointer hover:bg-gray-600 rounded-full">
				<HiEllipsisVertical size={26} />
			</SheetTrigger>
			{
               !close && <SheetContent className="w-screen overflow-x-hidden h-full flex justify-start flex-col items-center">
				<SheetHeader>
					<SheetTitle className="text-2xl text-center ">Wallet {wallet_number + 1}</SheetTitle>
				</SheetHeader>
				<SheetClose className="absolute left-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
					<ArrowLeft className="h-6 w-6" />
					<span className="sr-only">Close</span>
				</SheetClose>
				{wallets && found_wallet && (
					<div
						className={`p-3 bg-gray-800 max-w-3xl rounded-lg cursor-pointer hover:bg-gray-900 w-full mt-10 `}>
						<div className="flex items-center justify-between gap-6 group mb-3">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-white rounded-lg">
									<SiSolana color="black" size={12} />
								</div>
								<p className="text-base">Solana</p>
							</div>
							<div
								className="flex items-center hover:text-gray-400"
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
								<p>{format_public_key(found_wallet.sol_wallet.public_key)}</p> <Copy size={16} />
							</div>
						</div>
						<div className="flex items-center justify-between gap-6 group">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-white rounded-lg">
									<SiEthereum color="black" size={12} />
								</div>
								<p className="text-base">Ethereum</p>
							</div>
							<div
								className="flex items-center hover:text-gray-400"
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
								<p>{format_public_key(found_wallet.eth_wallet.public_key)}</p> <Copy size={16} />
							</div>
						</div>
					</div>
				)}
                {
                    wallets && found_wallet && (
                        <ShowPrivateKeys wallet_number={wallet_number} />
                    )
                }
                {
                    wallets && found_wallet && (
                        <RemoveWallet wallet_number={wallet_number} setClose={set_close} />
                    )
                }
			</SheetContent>
            }
		</Sheet>
	);
};

export default WalletSettingsSheet;
