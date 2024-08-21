import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58"
import { Wallet, HDNodeWallet } from "ethers";
import { getEthDerivationPath, getSolDerivationPath } from "./utils";

export const get_solana_wallet = (seed:Buffer, wallet_number:number) => {
    // "use server"
    const { key } = derivePath(getSolDerivationPath(wallet_number), seed.toString('hex'));
    const keypair = nacl.sign.keyPair.fromSeed(key);
    const solanaKeypair = Keypair.fromSecretKey(keypair.secretKey);
    return {public_key: solanaKeypair.publicKey.toBase58(), private_key:bs58.encode(solanaKeypair.secretKey)}
  }
  
  export const get_eth_wallet = (seed:Buffer, wallet_number:number) => {
    // "use server"
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(getEthDerivationPath(wallet_number));
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
    return {public_key: wallet.address, private_key:wallet.privateKey}
  }
  
  export const get_eth_sol_wallets = (mnemonic:string, wallet_number:number) => {
    // "use server"
    const seed = mnemonicToSeedSync(mnemonic);
    const eth_wallet = get_eth_wallet(seed, wallet_number);
    const sol_wallet = get_solana_wallet(seed, wallet_number);
    return {sol_wallet:{public_key:sol_wallet.public_key, private_key:sol_wallet.private_key}, eth_wallet:{public_key:eth_wallet.public_key, private_key:eth_wallet.private_key}, wallet_number}
  }
  
  export const get_wallets = (mnemonic:string, number_of_wallets:number) => {
    // "use server"
    try {
      const seed = mnemonicToSeedSync(mnemonic);
      const wallets: { sol_wallet:{ public_key:string, private_key:string }, eth_wallet: { public_key:string, private_key:string }, wallet_number:number  }[] = []
      for(let i = 0; i < number_of_wallets; i++) {
        const eth_wallet = get_eth_wallet(seed, i);
        const sol_wallet = get_solana_wallet(seed, i);
        wallets.push({sol_wallet:{public_key:sol_wallet.public_key, private_key:sol_wallet.private_key}, eth_wallet:{public_key:eth_wallet.public_key, private_key:eth_wallet.private_key}, wallet_number:i})
      }
      return wallets
    } catch (error:any) {
      console.log(error?.message)
      return []
    }
  }