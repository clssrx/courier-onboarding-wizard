import { useEffect, useReducer, useRef } from 'react';
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

	const wizardRef = useRef<HTMLDivElement>(null);
	const stepHeadingRef = useRef<HTMLHeadingElement>(null);

	const shouldFocusStepHeadingRef = useRef(false);
	const shouldFocusFirstErrorRef = useRef(false);

	function focusStepHeading() {
		const heading = stepHeadingRef.current;

		if (!heading) {
			return;
		}

		heading.setAttribute('tabindex', '-1');
		heading.focus();

		heading.addEventListener(
			'blur',
			() => {
				heading.removeAttribute('tabindex');
			},
			{ once: true },
		);
	}

	useEffect(() => {
		if (!shouldFocusStepHeadingRef.current) {
			return;
		}

		shouldFocusStepHeadingRef.current = false;
		focusStepHeading();
	}, [currentStep]);

	useEffect(() => {
		if (!shouldFocusFirstErrorRef.current) {
			return;
		}

		if (!hasValidationErrors(errors)) {
			return;
		}

		shouldFocusFirstErrorRef.current = false;
		shouldFocusStepHeadingRef.current = false;

		const firstInvalidField = wizardRef.current?.querySelector<HTMLElement>(
			'input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"]',
		);

		firstInvalidField?.focus();
	}, [errors, currentStep]);

	function requestStepHeadingFocus() {
		shouldFocusStepHeadingRef.current = true;
		shouldFocusFirstErrorRef.current = false;
	}

	function requestFirstInvalidFieldFocus() {
		shouldFocusFirstErrorRef.current = true;
		shouldFocusStepHeadingRef.current = false;
	}

	function goToStep(step: WizardStep) {
		requestStepHeadingFocus();
		dispatch({ type: 'GO_TO_STEP', step });
	}

	function goToStepAfterValidation(
		errorsForStep: FieldErrors,
		nextStep: WizardStep,
	) {
		if (hasValidationErrors(errorsForStep)) {
			requestFirstInvalidFieldFocus();
			dispatch({ type: 'SET_ERRORS', errors: errorsForStep });
			return;
		}

		dispatch({ type: 'CLEAR_ERRORS' });
		goToStep(nextStep);
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
		requestFirstInvalidFieldFocus();

		await submitApplicationFlow({
			applicationId: APPLICATION_ID,
			formData,
			config,
			dispatch,
		});
	}

	return (
		<div ref={wizardRef}>
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
					headingRef={stepHeadingRef}
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
					headingRef={stepHeadingRef}
					config={config}
					values={formData.eligibility}
					errors={errors}
					onChange={(field, value) =>
						dispatch({ type: 'UPDATE_ELIGIBILITY_FIELD', field, value })
					}
					onBack={() => goToStep('personal')}
					onNext={handleNext}
				/>
			)}

			{currentStep === 'documents' && (
				<DocumentsStep
					headingRef={stepHeadingRef}
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
					onBack={() => goToStep('eligibility')}
					onSubmit={handleSubmit}
				/>
			)}

			{currentStep === 'success' && (
				<SuccessStep
					applicationId={submittedApplicationId}
					headingRef={stepHeadingRef}
				/>
			)}
		</div>
	);
}
