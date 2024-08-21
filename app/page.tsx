import Header from "@/components/Header";
import { ArrowRightLeft, DollarSign, Plus, Send } from "lucide-react";

export default function Home() {
	const button_data = [
		{
			Icon: Plus,
			text: "Receive",
		},
		{
			Icon: Send,
			text: "Send",
		},
		{
			Icon: ArrowRightLeft,
			text: "Swap",
		},
		{
			Icon: DollarSign,
			text: "Buy",
		},
	];
 
	return (
		<div className="flex flex-col justify-center items-center p-1">
			<Header />
			<h1 className="text-4xl font-bold mt-8">$1400.34</h1>
			<p className="text-lg font-semibold text-green-400 mt-3">
				+$300.10 <span className="ml-1 p-1 bg-green-200/20 rounded-lg">+30%</span>
			</p>
			<div className="flex justify-center items-center gap-3 mt-8">
				{button_data.map((val) => {
					return (
						<div key={val.text} className="flex flex-col justify-center flex-wrap items-center gap-1 bg-gray-800 rounded-xl w-20 hover:bg-gray-700 cursor-pointer px-4 py-2">
							<val.Icon size={38} className="text-blue-400" />
							<p className="text-xs text-gray-300">{val.text}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
