export const AiVisualizationScreen = () => {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<p className="font-sans text-lg font-semibold leading-6">AI ассистент</p>
			<div className="flex size-full items-center justify-center pt-[10px]">
				<iframe className="size-full max-h-[800px]" src="https://ai.devscience.by/" />
			</div>
		</div>
	);
};
