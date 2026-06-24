type SuccessStepProps = {
	applicationId: string | null;
};

export function SuccessStep({ applicationId }: SuccessStepProps) {
	return (
		<section aria-labelledby='success-title'>
			<h2 id='success-title'>Application submitted</h2>

			<p>
				Your courier onboarding application has been submitted successfully.
			</p>

			{applicationId && (
				<p>
					<strong>Application ID:</strong> {applicationId}
				</p>
			)}
		</section>
	);
}
