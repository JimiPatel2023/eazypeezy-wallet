"use client"
import React, { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Check, ChevronRight, Copy, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { useWalletContext } from "@/app/context/AppContext";
import { SiEthereum, SiSolana } from "react-icons/si";
import { copy_text } from "@/lib/utils";

const ShowPrivateKeys = ({ wallet_number }: { wallet_number: number }) => {

    const { wallets } = useWalletContext();

    const found_wallet = wallets!.find((val) => val.wallet_number === wallet_number); 

    const [solana_copied, set_solana_copied] = useState(false)
    const [ethereum_copied, set_ethereum_copied] = useState(false)

    const private_key_data = found_wallet && [
        {
            ICON: SiSolana,
            text:"Solana",
            private_key:found_wallet.sol_wallet.private_key,
            set_copy_state:set_solana_copied,
            copy_state:solana_copied
        },
        {
            ICON: SiEthereum,
            text:"Ethereum",
            private_key:found_wallet.eth_wallet.private_key,
            set_copy_state:set_ethereum_copied,
            copy_state:ethereum_copied
        }
    ]

	return (
		<Drawer>
			<DrawerTrigger className={`p-3 bg-gray-800 max-w-3xl rounded-lg cursor-pointer hover:bg-gray-900 w-full mt-0 flex justify-between`}>
				<h3 className="text-base">Show Private Keys</h3>
				<ChevronRight />
			</DrawerTrigger>
			<DrawerContent className="h-[90%] flex flex-col justify-start items-center pt-3 px-3">
				<DrawerHeader>
					<DrawerTitle>Private Keys</DrawerTitle>
				</DrawerHeader>
                <Eye size={40} className="mt-2" />
                <h1 className="text-2xl font-semibold mt-2">Your Private Keys</h1>
                <p className="text-base mt-1">Never give out your private key to anyone.</p>
                {
                    private_key_data && private_key_data.map(data => {
                        return (
                            <div key={data.text} className="flex flex-col justify-center items-start rounded-2xl hover:bg-gray-800/20 max-w-2xl w-full border border-gray-400 mt-4">
                                <div className="w-full text-center bg-gray-900  font-semibold flex justify-center items-center rounded-t-2xl p-1 gap-2"><data.ICON /> {data.text}</div>
                                <div className="break-all p-2 h-[80px] text-start">{data.private_key}</div>
                                <div className="w-full text-center bg-white text-black text-base font-semibold flex justify-center items-center rounded-b-2xl p-1 gap-2 cursor-pointer" onClick={(e) => {
                                    copy_text(data.private_key)
                                    data.set_copy_state(true)
                                }}>{data.copy_state ? <>Copied <Check size={18} /></> : <><Copy size={18} /> Copy</>}</div>
                            </div>
                        )
                    })
                }
                <DrawerClose className="absolute bottom-2 w-full p-3"><Button variant={"secondary"} className="w-full p-3">Close</Button></DrawerClose>
			</DrawerContent>
		</Drawer>
	);
};

export default ShowPrivateKeys;
