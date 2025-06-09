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
		<div className="flex w-full justify-center bg-background-primary px-4 sm:px-6 lg:px-10">
			<div className="flex w-full max-w-screen-xl flex-col py-[40px] sm:py-[50px]">
				<div className="mb-[20px] font-montserrat text-[18px] font-normal leading-[22px] sm:mb-[30px] sm:text-[20px] sm:leading-[24px]">
					Часто задаваемые вопросы
				</div>
				<div className="flex flex-col gap-[10px] sm:gap-[15px]">
					{questions.map((question, index) => (
						<div
							key={index}
							className={twMerge(
								'flex cursor-pointer flex-col justify-between gap-[10px] overflow-hidden rounded-[16px] bg-white px-[16px] py-[20px] transition-all duration-300 ease-in-out sm:flex-row sm:rounded-[20px] sm:py-[23px] sm:pl-[20px] sm:pr-[45px]',
								selectedQuestions.includes(index) ? 'max-h-full' : 'max-h-[64px]',
							)}
							onClick={() => handleQuestionClick(index)}
						>
							<div className="flex flex-col gap-[20px] sm:gap-[40px]">
								<div className="font-montserrat text-[18px] font-semibold leading-[22px] sm:text-[20px] sm:leading-[24px]">
									{question}
								</div>
								<div
									key={index}
									className="whitespace-pre-wrap font-montserrat text-[16px] font-normal leading-[22px] sm:text-[20px] sm:leading-[24px]"
								>
									<span
										dangerouslySetInnerHTML={{ __html: descriptions[index] }}
									/>
								</div>
							</div>
							<div className="mt-2 flex sm:mt-0 sm:flex-col sm:justify-start">
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
