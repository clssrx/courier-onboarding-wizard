import type { ReactNode, Ref } from 'react';
import { StepProgress } from './StepProgress';

type WizardStepLayoutProps = {
	title: string;
	titleId: string;
	stepNumber?: number;
	totalSteps?: number;
	headingRef?: Ref<HTMLHeadingElement>;
	children: ReactNode;
};

export function WizardStepLayout({
	title,
	titleId,
	stepNumber,
	totalSteps = 3,
	headingRef,
	children,
}: WizardStepLayoutProps) {
	const headingLabel =
		stepNumber !== undefined
			? `Step ${stepNumber} of ${totalSteps}: ${title}`
			: title;

	return (
		<section>
			{stepNumber !== undefined && (
				<StepProgress currentStep={stepNumber} totalSteps={totalSteps} />
			)}

			<h2
				id={titleId}
				ref={headingRef}
				className='step-title'
				aria-label={headingLabel}
			>
				{title}
			</h2>
			{children}
		</section>
	);
}
