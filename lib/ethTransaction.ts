"use server"
import { ethers, parseUnits } from "ethers";

export const send_eth_transaction = async (secretKey:string, to:string, amount:number) => {
    "use server"
    try {
      const network = process.env.ETHEREUM_NETWORK!;
      const provider = new ethers.AlchemyProvider(
        network,
        process.env.API_KEY!
      );

      const signer = new ethers.Wallet(secretKey).connect(provider);
  
      const tx = await signer.sendTransaction({
        to: to,
        value: parseUnits(`${amount}`, "ether"),
      });
      console.log("Mining transaction...");
      console.log(`https://${network}.etherscan.io/tx/${tx.hash}`);
      const receipt = await tx.wait();

      return tx.hash;
    } catch (error:any) {
      console.log(error.message)
    }
}