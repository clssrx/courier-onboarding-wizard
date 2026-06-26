type StepProgressProps = {
	currentStep: number;
	totalSteps?: number;
};

export function StepProgress({
	currentStep,
	totalSteps = 3,
}: StepProgressProps) {
	return (
		<div className='step-progress' aria-hidden='true'>
			<p className='step-progress-label'>
				Step {currentStep} of {totalSteps}
			</p>

			<progress
				className='step-progress-bar'
				value={currentStep}
				max={totalSteps}
			/>
		</div>
	);
}
