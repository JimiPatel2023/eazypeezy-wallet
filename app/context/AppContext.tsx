"use client";
import { get_eth_sol_wallets } from "@/lib/serverActions";
import { Accounts } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useContext } from "react";
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
    change_default_wallet:(index: number) => void
}>({
	accounts: null,
	wallets: null,
	change_default_account: (index) => {},
	create_new_wallet: (wallet_number) => {},
    create_new_account:(SRP) => {},
    change_default_wallet:(index) => {}
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
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
			}
		}
	}, [router, update]);

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
            toast.success("New Wallet Created!", {
                position: "top-right",
                autoClose: 5000,
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
            toast.info("Default account changed!", {
                position: "top-right",
                autoClose: 5000,
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
            toast.info("Default wallet changed!", {
                position: "top-right",
                autoClose: 5000,
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
        toast.success("New account created!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    }

	return <WalletContext.Provider value={{ accounts, wallets, change_default_account, create_new_wallet, create_new_account, change_default_wallet }}>{children}</WalletContext.Provider>;
};

export const useWalletContext = () => {
	return useContext(WalletContext);
};

export default WalletContext;
