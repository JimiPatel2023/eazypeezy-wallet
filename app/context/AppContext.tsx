"use client";
import { get_eth_sol_wallets, get_wallet_balance } from "@/lib/serverActions";
import { Accounts } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useContext, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

const WalletContext = createContext<{
	accounts: Accounts | null;
	wallets:
		| {
				sol_wallet: {
					public_key: string;
					private_key: string;
				};
				eth_wallet: {
					public_key: string;
					private_key: string;
				};
				wallet_number: number;
		  }[]
		| null;
	create_new_wallet: (wallet_number: number) => void | null;
	change_default_account: (index: number) => void | null;
    create_new_account:(SRP: string) => void;
    change_default_wallet:(index: number) => void;
	remove_wallet:(wallet_number: number) => void;
	wallet_balance: {
		eth_balance: number;
		sol_balance: number;
	} | null
}>({
	accounts: null,
	wallets: null,
	change_default_account: (index) => {},
	create_new_wallet: (wallet_number) => {},
    create_new_account:(SRP) => {},
    change_default_wallet:(index) => {},
	remove_wallet:(wallet_number) => {},
	wallet_balance:null
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();

	const [accounts, setAccounts] = useState<Accounts | null>(null);
    const [update, setUpdate] = useState<number>(0)
	const [wallets, setWallets] = useState<
		| {
				sol_wallet: {
					public_key: string;
					private_key: string;
				};
				eth_wallet: {
					public_key: string;
					private_key: string;
				};
				wallet_number: number;
		  }[]
		| null
	>(null);

	const [wallet_balance, set_wallet_balance] = useState<{eth_balance:number, sol_balance:number} | null>(null)

	const get_wallets = (accounts_object: Accounts) => {
		const wallet = [];
		for (let i = 0; i < accounts_object.details[accounts_object.default_account].wallets.length; i++) {
			const temp_wallet = get_eth_sol_wallets(accounts_object.details[accounts_object.default_account].secret_phase, accounts_object.details[accounts_object.default_account].wallets[i]);
			wallet.push(temp_wallet);
		}
		setWallets(wallet);
	};

	useEffect(() => {
		const accounts = localStorage.getItem("accounts");
		if (!accounts) {
			router.push("/add-account");
		} else {
			try {
				const accounts_object: Accounts = JSON.parse(accounts);
                get_wallets(accounts_object)
                setAccounts(accounts_object)
			} catch (error) {
				router.push("/add-account");
				localStorage.clear();
				toast.error("Unexpected error!", {
					position: "bottom-right",
					autoClose: 1500,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
			}
		}
	}, [router, update]);

	const set_balance = async ({eth_public_key, sol_public_key}:{eth_public_key:string, sol_public_key:string}) => {
		const balance = await get_wallet_balance({eth_public_key, sol_public_key})
		if(balance) {
			set_wallet_balance({eth_balance:balance.eth_balance, sol_balance:balance.sol_balance})
		}
	}

	useEffect(() => {
		if(wallets && accounts) {
			const current_wallet = wallets.find(v=> v.wallet_number == accounts.details[accounts.default_account].default_wallet)
			if(current_wallet) {
				set_balance({eth_public_key:current_wallet.eth_wallet.public_key, sol_public_key:current_wallet.sol_wallet.public_key})
			}
		}
	}, [wallets, accounts])

	const create_new_wallet = (wallet_number: number) => {
		if (accounts) {
			localStorage.clear();
			localStorage.setItem(
				"accounts",
				JSON.stringify({
					...accounts,
					details: accounts.details.map((val, index) => {
						if (index === accounts.default_account) {
							return { ...val, wallets: [...val.wallets, wallet_number], default_wallet: wallet_number };
						} else {
							return val;
						}
					}),
				})
			);
            setUpdate(prev=> prev+1)
			set_wallet_balance(null)
            toast.success("New Wallet Created!", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
		}
	};

	const change_default_account = (index: number) => {
		if (accounts) {
			localStorage.clear();
			localStorage.setItem("accounts", JSON.stringify({ ...accounts, default_account: index }));
            setUpdate(prev=>prev+1)
			set_wallet_balance(null)
            toast.info("Default account changed!", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
		}
	};

    const change_default_wallet = (index:number) => {
        if(accounts) {
            localStorage.clear()
            localStorage.setItem("accounts", JSON.stringify({ ...accounts, details: accounts.details.map((val, i) => {
                if (i === accounts.default_account) {
                    return {...val, default_wallet:index}
                } else {
                    return val
                }
            }), }));
            setUpdate(prev=>prev+1)
			set_wallet_balance(null)
            toast.info("Default wallet changed!", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
    }

    const create_new_account = (SRP:string) => {
        router.push("/");
        const accounts = localStorage.getItem("accounts");
		if (!accounts) {
			localStorage.setItem(
				"accounts",
				`${JSON.stringify({
					details: [{ secret_phase: SRP, wallets: [0], account_name:"Account 1", default_wallet:0 }],
					default_account:0
				})}`
			);
		} else {
			try {
				const accounts_object:Accounts = JSON.parse(accounts);
				localStorage.clear();
				localStorage.setItem(
					"accounts",
					`${JSON.stringify({
						details: [...accounts_object.details, { secret_phase: SRP, wallets: [0], account_name:`Account ${accounts_object.details.length+1}`, default_wallet:0 }],
						default_account:accounts_object.details.length
					})}`
				);
                
			} catch (error:any) {
				console.log(error.message)
			}
		}
        setUpdate(prev=>prev+1)
		set_wallet_balance(null)
        toast.success("New account created!", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    }

	const remove_wallet = (wallet_number:number) => {
		if (accounts) {
			localStorage.clear();
			const current_account = accounts.details[accounts.default_account]
			if(current_account.wallets.length === 1) {
				const new_accounts = accounts.details.filter((v,i) => i !== accounts.default_account)
				if(new_accounts.length > 0) {
					localStorage.setItem(
						"accounts",
						JSON.stringify({
							details: new_accounts,
							default_account:[new_accounts.length-1]
						})
					);
				}
			} else {
				const new_wallets = current_account.wallets.filter(v => v !== wallet_number);
				console.log(new_wallets)
				const new_account = {...current_account, wallets:new_wallets, default_wallet:new_wallets[0]}
				localStorage.setItem(
					"accounts",
					JSON.stringify({
						...accounts,
						details: accounts.details.map((val, index) => {
							if (index === accounts.default_account) {
								return new_account
							} else {
								return val;
							}
						}),
					})
				);
			}
            setUpdate(prev=> prev+1)
			set_wallet_balance(null)
            toast.success("Wallet Deleted!", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
			setWallets(wallets)
		}
	}

	return <WalletContext.Provider value={{ accounts, wallets, change_default_account, create_new_wallet, create_new_account, change_default_wallet, remove_wallet, wallet_balance }}>{children}</WalletContext.Provider>;
};

export const useWalletContext = () => {
	return useContext(WalletContext);
};

export default WalletContext;
