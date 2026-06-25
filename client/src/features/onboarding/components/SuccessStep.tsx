import type { Ref } from 'react';

type SuccessStepProps = {
	headingRef?: Ref<HTMLHeadingElement>;
	applicationId: string | null;
};

export function SuccessStep({ headingRef, applicationId }: SuccessStepProps) {
	const describedBy = applicationId
		? 'success-message success-application-id'
		: 'success-message';

	return (
		<section aria-labelledby='success-title' aria-describedby={describedBy}>
			<h2
				id='success-title'
				ref={headingRef}
				className='step-title'
				aria-describedby={describedBy}
			>
				Application submitted
			</h2>

			<p id='success-message'>
				Your courier onboarding application has been submitted successfully.
			</p>

			{applicationId && (
				<p id='success-application-id'>
					<strong>Application ID:</strong> {applicationId}
				</p>
			)}
		</section>
	);
}
