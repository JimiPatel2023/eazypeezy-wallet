import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { generateMnemonic } from "bip39";
import { PublicKey } from "@solana/web3.js";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

enum Blockchain {
  SOL,
  ETH
}

export const getSolDerivationPath = (wallet_number:number) => `m/44'/501'/${wallet_number}'/0'`
export const getEthDerivationPath = (wallet_number:number) => `m/44'/60'/${wallet_number}'/0'`

export const generate_mnemonic_phrase = () => generateMnemonic()

export interface Accounts {
  details: { secret_phase:string, wallets:number[], default_wallet:number, account_name:string }[];
  default_account:number
}

export const get_words_from_SRP = (SRP:string) => {
  return SRP.match(/\b\w+\b/g);
}

export const copy_text = (text:string) => {
  navigator.clipboard.writeText(text)
}

export const format_public_key = (public_key:string) => {
  if(public_key.toLowerCase().startsWith("0x")) {
    return `${public_key.slice(0, 6)}...${public_key.slice(-4)}`
  } else {
    return `${public_key.slice(0, 4)}...${public_key.slice(-4)}`
  }
}

export const is_sol_public_key_valid = async (public_key:string) => {
  try {
    new PublicKey(public_key)
    return true
  } catch (error) {
    return false
  }
}