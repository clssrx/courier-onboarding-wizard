import type { ReactNode, Ref } from 'react';

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
	return (
		<section aria-labelledby={titleId}>
			{stepNumber !== undefined && (
				<p className='step-indicator'>
					Step {stepNumber} of {totalSteps}
				</p>
			)}

			<h2 id={titleId} ref={headingRef} className='step-title'>
				{title}
			</h2>

			{children}
		</section>
	);
}
