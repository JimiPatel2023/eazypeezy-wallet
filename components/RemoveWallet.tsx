"use client"
import React, { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Check, ChevronRight, Copy, Eye, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useWalletContext } from "@/app/context/AppContext";
import { SiEthereum, SiSolana } from "react-icons/si";
import { copy_text, format_public_key } from "@/lib/utils";

const RemoveWallet = ({ wallet_number, setClose }: { wallet_number: number, setClose:React.Dispatch<React.SetStateAction<boolean>> }) => {

    const { wallets, remove_wallet } = useWalletContext();

    const found_wallet = wallets!.find((val) => val.wallet_number === wallet_number); 

	return (
		<Drawer>
			<DrawerTrigger className={`p-3 bg-gray-800 max-w-3xl rounded-lg cursor-pointer hover:bg-gray-900 w-full mt-0 flex justify-between`}>
				<h3 className="text-base text-red-500 font-semibold">Remove Wallet</h3>
				<ChevronRight />
			</DrawerTrigger>
			<DrawerContent className="h-[90%] flex flex-col justify-start items-center pt-3 px-3">
				<DrawerHeader>
					<DrawerTitle>Remove Wallet</DrawerTitle>
				</DrawerHeader>
                <TriangleAlert size={50} className="mt-2 text-red-400" />
                <h1 className="text-2xl font-semibold mt-3">Are you sure you want to remove this wallet?</h1>
                <p className="text-base mt-0 text-gray-400 p-4 text-center">Removing from the account will not delete the wallet’s contents. It will still be available by importing your secret recovery phrase.</p>

                <div className="absolute bottom-2 w-full p-3 flex gap-2 justify-center items-center"><DrawerClose className="w-full"><Button variant={"secondary"} className="w-full p-3">Close</Button></DrawerClose><DrawerClose className="w-full" onClick={(e) => {setClose(true); remove_wallet(wallet_number);}}><Button variant={"destructive"} className="w-full p-3">Remove</Button></DrawerClose></div>
			</DrawerContent>
		</Drawer>
	);
};

export default RemoveWallet;
