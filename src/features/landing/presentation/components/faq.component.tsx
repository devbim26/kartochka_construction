import { Chevron } from '@core';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { descriptions, questions } from '../../constants';

export const FAQ = () => {
	const [selectedQuestions, setSelectedQuestions] = useState<number[]>([0]);

	const handleQuestionClick = (index: number) => {
		setSelectedQuestions((prevSelected) =>
			prevSelected.includes(index)
				? prevSelected.filter((i) => i !== index)
				: [...prevSelected, index],
		);
	};

	return (
		<div className="flex w-full justify-center bg-background-primary">
			<div className="flex w-[73.18%] flex-col py-[50px]">
				<div className="mb-[30px] flex font-montserrat text-[20px] font-normal leading-[24px]">
					Часто задаваемые вопросы
				</div>
				<div className="flex flex-col gap-[15px]">
					{questions.map((question, index) => (
						<div
							key={index}
							className={twMerge(
								'flex cursor-pointer flex-row justify-between gap-[10px] overflow-hidden rounded-[20px] bg-white py-[23px] pl-[20px] pr-[45px] transition-all duration-300 ease-in-out',
								selectedQuestions.includes(index) ? 'max-h-[100%]' : 'max-h-[64px]',
							)}
							onClick={() => handleQuestionClick(index)}
						>
							<div className="flex flex-col gap-[40px]">
								<div className="font-montserrat text-[20px] font-semibold leading-[24px]">
									{question}
								</div>
								<div
									key={index}
									className="whitespace-pre-wrap font-montserrat text-[20px] font-normal leading-[24px]"
								>
									<span
										dangerouslySetInnerHTML={{ __html: descriptions[index] }}
									/>
								</div>
							</div>
							<div className="flex flex-col justify-start">
								<Chevron
									color={selectedQuestions.includes(index) ? 'grey' : 'primary'}
									direction={selectedQuestions.includes(index) ? 'down' : 'right'}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
