"use client"
import React, { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiEthereum, SiSolana } from "react-icons/si";
import { useWalletContext } from "@/app/context/AppContext";
import { Button } from "./ui/button";
import { send_sol_transaction } from "@/lib/serverActions";
import { Input } from "./ui/input";
import { toast } from "react-toastify";
import { send_eth_transaction } from "@/lib/ethTransaction";

const SendSheet = ({ children }: { children: React.ReactNode }) => {

    const [blockchain, setBlockchain] = useState<string>("sol")
    const {wallets, accounts, wallet_balance} = useWalletContext()
    const [amount, setAmount] = useState<number | undefined>(undefined)
    const [to, set_to] = useState("")
    const [loading, setLoading] = useState(false)

	return (
		<Sheet modal={false}>
			<SheetTrigger>{children}</SheetTrigger>
			<SheetContent side={"bottom"} className="h-full overflow-y-scroll overflow-x-hidden">
				<SheetHeader>
					<SheetTitle className="text-2xl text-center">Send</SheetTitle>
				</SheetHeader>
				<SheetClose className="absolute left-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
					<ArrowLeft className="h-6 w-6" />
					<span className="sr-only">Close</span>
				</SheetClose>
                <div className="pt-5 flex flex-col justify-center items-center flex-wrap gap-2 w-full py-10">
                <Select defaultValue="sol" value={blockchain} onValueChange={(val) => setBlockchain(val)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={blockchain === "sol" ? (<SelectItem value="sol"><div className="flex justify-center items-center gap-3 text-lg"><SiSolana /> Solana</div></SelectItem>) : (<SelectItem value="eth"><div className="flex justify-center items-center gap-3 text-lg"><SiEthereum /> Ethereum</div></SelectItem>)}/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="sol"><div className="flex justify-center items-center gap-3 text-lg"><SiSolana /> Solana</div></SelectItem>
						<SelectItem value="eth"><div className="flex justify-center items-center gap-3 text-lg"><SiEthereum /> Ethereum</div></SelectItem>
					</SelectContent>
				</Select>
                {
                    accounts && wallets && wallet_balance && (
                        <>
                            <span className="flex justify-center items-center rounded-full p-3 text-4xl bg-gray-800 font-bold h-20 w-20 mt-3">
                                A{accounts.default_account+1}
                            </span>
                            <p className="text-lg text-gray-300">Wallet {accounts.details[accounts.default_account].default_wallet+1}</p>
                            <p className="bg-gray-800 text-xs text-gray-200 cursor-pointer p-1 rounded-sm">{blockchain === "sol" ? wallets.find(v=> v.wallet_number === accounts.details[accounts.default_account].default_wallet)!.sol_wallet.public_key : wallets.find(v=> v.wallet_number === accounts.details[accounts.default_account].default_wallet)!.eth_wallet.public_key}</p>
                            <input autoFocus value={amount} onChange={(e) => setAmount(+e.target.value)} className="mt-6 border-none num-input bg-transparent outline-none text-5xl text-center" type="number" placeholder="0" />
                            <Input value={to} onChange={(e) => set_to(e.target.value)} type="text" placeholder="Send to..." className="my-4 max-w-sm outline-none border-b-1" />
                            <Button onClick={async (e) => {
                                if(blockchain === "sol" && amount) {
                                    setLoading(true)
                                    const hash = await send_sol_transaction(wallets.find(v=> v.wallet_number === accounts.details[accounts.default_account].default_wallet)!.sol_wallet.private_key, to, amount * (10**9))
                                    toast.success("Transaction completed!", {
                                        position: "bottom-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        theme: "dark",
                                    });
                                    setLoading(false)
                                } else if(blockchain === "eth" && amount) {
                                    setLoading(true)
                                    const hash = await send_eth_transaction(wallets.find(v=> v.wallet_number === accounts.details[accounts.default_account].default_wallet)!.eth_wallet.private_key, to, amount)
                                    toast.success("Transaction completed!", {
                                        position: "bottom-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        theme: "dark",
                                    });
                                    setLoading(false)
                                }
                            }} disabled={typeof amount !== "number" || (blockchain==="sol" ? wallet_balance.sol_balance < amount : wallet_balance.eth_balance < amount) || to.trim().length===0 || loading} className="w-full p-3 max-w-sm absolute bottom-7 flex gap-2 justify-center items-center">{loading ? "Sending..." : blockchain==="sol" ? (wallet_balance.sol_balance < (amount||0) ? "Inefficient balance" : "Send") : (wallet_balance.eth_balance < (amount||0) ? "Inefficient balance" : "Send")}</Button>
                        </>
                    )
                }
                </div>
			</SheetContent>
		</Sheet>
	);
};

export default SendSheet;
