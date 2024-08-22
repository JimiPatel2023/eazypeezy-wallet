import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58"
import { Wallet, HDNodeWallet } from "ethers";
import { getEthDerivationPath, getSolDerivationPath } from "./utils";
import axios from "axios"

const sol_rpc_base_url = "https://solana-mainnet.g.alchemy.com/v2/y7kjH1FfrGOd2HitEahJeRxjxOPhU2z9";
const eth_rpc_base_url = "https://eth-mainnet.g.alchemy.com/v2/y7kjH1FfrGOd2HitEahJeRxjxOPhU2z9"

export const get_solana_wallet = (seed: Buffer, wallet_number: number) => {
  // "use server"
  const { key } = derivePath(getSolDerivationPath(wallet_number), seed.toString('hex'));
  const keypair = nacl.sign.keyPair.fromSeed(key);
  const solanaKeypair = Keypair.fromSecretKey(keypair.secretKey);
  return { public_key: solanaKeypair.publicKey.toBase58(), private_key: bs58.encode(solanaKeypair.secretKey) }
}

export const get_eth_wallet = (seed: Buffer, wallet_number: number) => {
  // "use server"
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(getEthDerivationPath(wallet_number));
  const privateKey = child.privateKey;
  const wallet = new Wallet(privateKey);
  return { public_key: wallet.address, private_key: wallet.privateKey }
}

export const get_eth_sol_wallets = (mnemonic: string, wallet_number: number) => {
  // "use server"
  const seed = mnemonicToSeedSync(mnemonic);
  const eth_wallet = get_eth_wallet(seed, wallet_number);
  const sol_wallet = get_solana_wallet(seed, wallet_number);
  return { sol_wallet: { public_key: sol_wallet.public_key, private_key: sol_wallet.private_key }, eth_wallet: { public_key: eth_wallet.public_key, private_key: eth_wallet.private_key }, wallet_number }
}

export const get_wallets = (mnemonic: string, number_of_wallets: number) => {
  // "use server"
  try {
    const seed = mnemonicToSeedSync(mnemonic);
    const wallets: { sol_wallet: { public_key: string, private_key: string }, eth_wallet: { public_key: string, private_key: string }, wallet_number: number }[] = []
    for (let i = 0; i < number_of_wallets; i++) {
      const eth_wallet = get_eth_wallet(seed, i);
      const sol_wallet = get_solana_wallet(seed, i);
      wallets.push({ sol_wallet: { public_key: sol_wallet.public_key, private_key: sol_wallet.private_key }, eth_wallet: { public_key: eth_wallet.public_key, private_key: eth_wallet.private_key }, wallet_number: i })
    }
    return wallets
  } catch (error: any) {
    console.log(error?.message)
    return []
  }
}

interface SolApiResponse {
  jsonrpc: string;
  result: {
      context: {
          apiVersion: string;
          slot: number
      },
      value: number
  };
  id: number
}

interface EthApiResponse {
  jsonrpc: string;
  id: number;
  result: string
}

export const get_wallet_balance = async ({sol_public_key, eth_public_key}:{sol_public_key:string, eth_public_key:string}) => {
  try {
    let sol_balance:number|undefined;
    let eth_balance:number|undefined;
    const promise1 = async () => {
      const response = await axios.post(sol_rpc_base_url, {
        "jsonrpc": "2.0",
        "id": 1,
        "method":"getBalance", 
        "params":
        [sol_public_key]    
      }, {responseType:"json"});
      const data:SolApiResponse = response.data;
      if(typeof data.result.value === "number") {
        sol_balance = data.result.value / (10**9)
      }
    }
    const promise2 = async () => {
      const response = await axios.post(eth_rpc_base_url, {
        "id": 1,
        "jsonrpc": "2.0",
        "params": [
          eth_public_key,
          "latest"
        ],
        "method": "eth_getBalance"    
      }, {responseType:"json"});
      const data:EthApiResponse = response.data;
      if(typeof data.result === "string") {
        eth_balance = (parseInt(data.result.slice(2))) / (10**18)
      }
    }

    await Promise.all([promise1(), promise2()]);

    if(typeof sol_balance === "number" && typeof eth_balance === "number") {
      return {eth_balance, sol_balance}
    }
  } catch (error:any) {
    console.log(error.message)
  }
}