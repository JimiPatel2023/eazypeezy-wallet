import { copy_text } from "@/lib/utils";
import React from "react";
import { toast } from "react-toastify";

interface WordGridCardProps {
	words: string[];
	whole_string: string;
}

const WordGridCard: React.FC<WordGridCardProps> = ({ words, whole_string }) => {
	if (words.length !== 12) {
		throw new Error("WordGridCard requires exactly 12 words");
	}

	return (
		<div
			className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto cursor-pointer hover:bg-gray-900"
			onClick={(e) => {
				copy_text(whole_string);
				toast.info("Copied!", {
					position: "bottom-right",
					autoClose: 1500,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
			}}>
			<div className="grid grid-cols-3 lg:gap-x-16 md:gap-x-10  xl:gap-x-20 gap-x-6 gap-y-6">
				{words.map((word, index) => (
					<div key={index} className="flex items-center">
						<span className="text-gray-500 mr-2">{index + 1}</span>
						<span className="text-white">{word}</span>
					</div>
				))}
			</div>
			<div className="text-center text-gray-500 text-sm mt-4">Click anywhere on this card to copy</div>
		</div>
	);
};

export default WordGridCard;
