import { submitApplication } from '../../../api/onboardingApi';
import type { OnboardingConfig, WizardFormData } from '../types';
import type { WizardAction } from '../state/wizardReducer';
import {
	getApiErrorMessage,
	getStepForFirstFieldError,
	hasApiFieldErrors,
	isApiError,
	mapApiFieldErrorsToFieldErrors,
} from './apiErrors';
import { buildSubmitPayload } from './submitPayload';
import { hasValidationErrors, validateDocuments } from '../validation';

type WizardDispatch = (action: WizardAction) => void;

type SubmitApplicationFlowArgs = {
	applicationId: string;
	formData: WizardFormData;
	config: OnboardingConfig;
	dispatch: WizardDispatch;
	onFieldErrors?: () => void;
	onSuccess?: () => void;
};

export async function submitApplicationFlow({
	applicationId,
	formData,
	config,
	dispatch,
	onFieldErrors,
	onSuccess,
}: SubmitApplicationFlowArgs): Promise<void> {
	const documentErrors = validateDocuments(
		formData.documents,
		config,
		formData.eligibility.vehicleType,
	);

	if (hasValidationErrors(documentErrors)) {
		onFieldErrors?.();
		dispatch({ type: 'SET_ERRORS', errors: documentErrors });
		return;
	}

	dispatch({ type: 'CLEAR_ERRORS' });
	dispatch({ type: 'SUBMIT_STARTED' });

	try {
		const response = await submitApplication(
			applicationId,
			buildSubmitPayload(formData, config),
		);

		onSuccess?.();

		dispatch({
			type: 'SUBMIT_SUCCEEDED',
			applicationId: response.applicationId,
		});
	} catch (error) {
		// 422 and 409 responses use field-level dot paths. They need to be
		// shown on the matching field and step, not as a generic submit error.
		if (
			isApiError(error) &&
			(error.status === 422 || error.status === 409) &&
			hasApiFieldErrors(error.data)
		) {
			const fieldErrors = mapApiFieldErrorsToFieldErrors(error.data);

			onFieldErrors?.();

			dispatch({ type: 'SET_ERRORS', errors: fieldErrors });
			dispatch({
				type: 'GO_TO_STEP',
				step: getStepForFirstFieldError(fieldErrors),
			});
			return;
		}

		// Transient or unexpected submit failures keep the form data in place
		// and show a retryable form-level error.
		if (isApiError(error)) {
			dispatch({
				type: 'SUBMIT_FAILED',
				message: getApiErrorMessage(error),
			});
			return;
		}

		dispatch({
			type: 'SUBMIT_FAILED',
			message: 'Something went wrong. Please try again.',
		});
	}
}
