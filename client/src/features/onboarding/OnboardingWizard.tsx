import { useReducer } from 'react';
import type { FieldErrors, OnboardingConfig, WizardStep } from './types';
import { DocumentsStep } from './components/DocumentsStep';
import { EligibilityStep } from './components/EligibilityStep';
import { PersonalDetailsStep } from './components/PersonalDetailsStep';
import { SuccessStep } from './components/SuccessStep';
import { initialWizardState, wizardReducer } from './state/wizardReducer';
import {
	hasValidationErrors,
	validateEligibility,
	validatePersonalDetails,
} from './validation';
import { submitApplicationFlow } from './submission/submitApplicationFlow';

type OnboardingWizardProps = {
	config: OnboardingConfig;
};

const APPLICATION_ID = 'new-application';

export function OnboardingWizard({ config }: OnboardingWizardProps) {
	const [state, dispatch] = useReducer(wizardReducer, initialWizardState);

	const {
		currentStep,
		formData,
		errors,
		submitStatus,
		submitError,
		submittedApplicationId,
	} = state;

	function goToStepAfterValidation(
		errorsForStep: FieldErrors,
		nextStep: WizardStep,
	) {
		if (hasValidationErrors(errorsForStep)) {
			dispatch({ type: 'SET_ERRORS', errors: errorsForStep });
			return;
		}

		dispatch({ type: 'CLEAR_ERRORS' });
		dispatch({ type: 'GO_TO_STEP', step: nextStep });
	}

	function handleNext() {
		switch (currentStep) {
			case 'personal':
				goToStepAfterValidation(
					validatePersonalDetails(formData.personal),
					'eligibility',
				);
				return;

			case 'eligibility':
				goToStepAfterValidation(
					validateEligibility(formData.eligibility, config),
					'documents',
				);
				return;

			default:
				return;
		}
	}

	async function handleSubmit() {
		await submitApplicationFlow({
			applicationId: APPLICATION_ID,
			formData,
			config,
			dispatch,
		});
	}

	return (
		<div>
			{/* Wizard step indicator -> to become a progress bar later */}
			{currentStep !== 'success' && (
				<p>
					Step{' '}
					{currentStep === 'personal'
						? '1'
						: currentStep === 'eligibility'
							? '2'
							: '3'}{' '}
					of 3
				</p>
			)}

			{currentStep === 'personal' && (
				<PersonalDetailsStep
					values={formData.personal}
					errors={errors}
					onChange={(field, value) =>
						dispatch({ type: 'UPDATE_PERSONAL_FIELD', field, value })
					}
					onNext={handleNext}
				/>
			)}

			{currentStep === 'eligibility' && (
				<EligibilityStep
					config={config}
					values={formData.eligibility}
					errors={errors}
					onChange={(field, value) =>
						dispatch({ type: 'UPDATE_ELIGIBILITY_FIELD', field, value })
					}
					onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'personal' })}
					onNext={handleNext}
				/>
			)}

			{currentStep === 'documents' && (
				<DocumentsStep
					config={config}
					vehicleType={formData.eligibility.vehicleType}
					documents={formData.documents}
					errors={errors}
					submitError={submitError}
					isSubmitting={submitStatus === 'submitting'}
					onDocumentChange={(documentType, value) =>
						dispatch({
							type: 'UPDATE_DOCUMENT_NUMBER',
							documentType,
							value,
						})
					}
					onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'eligibility' })}
					onSubmit={handleSubmit}
				/>
			)}

			{currentStep === 'success' && (
				<SuccessStep applicationId={submittedApplicationId} />
			)}
		</div>
	);
}
