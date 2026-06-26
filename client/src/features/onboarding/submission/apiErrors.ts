import type {
	ApiError,
	ApiFieldErrorResponse,
	ApiMessageErrorResponse,
	FieldErrors,
	WizardStep,
} from '../types';

export function isApiError(error: unknown): error is ApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		'data' in error
	);
}

export function hasApiFieldErrors(
	data: ApiError['data'],
): data is ApiFieldErrorResponse {
	return 'errors' in data && Array.isArray(data.errors);
}

function hasApiMessage(
	data: ApiError['data'],
): data is ApiMessageErrorResponse {
	return 'message' in data;
}

export function mapApiFieldErrorsToFieldErrors(
	errorResponse: ApiFieldErrorResponse,
): FieldErrors {
	return errorResponse.errors.reduce<FieldErrors>((fieldErrors, error) => {
		fieldErrors[error.field] = error.message;
		return fieldErrors;
	}, {});
}

// API field names use dot paths, such as "personal.email" or
// "documents.drivers_license.number". The first segment tells the wizard
// which step should be shown before focusing the invalid field.
export function getStepForField(field: string): WizardStep {
	if (field.startsWith('personal.')) {
		return 'personal';
	}

	if (field.startsWith('eligibility.')) {
		return 'eligibility';
	}

	if (field.startsWith('documents.')) {
		return 'documents';
	}

	return 'documents';
}

export function getStepForFirstFieldError(errors: FieldErrors): WizardStep {
	const firstErrorField = Object.keys(errors)[0];

	if (!firstErrorField) {
		return 'documents';
	}

	return getStepForField(firstErrorField);
}

export function getApiErrorMessage(error: ApiError): string {
	if (hasApiMessage(error.data)) {
		return error.data.message;
	}

	return 'Something went wrong. Please try again.';
}
