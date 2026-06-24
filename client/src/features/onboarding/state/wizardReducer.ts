import type {
	DocumentFormFields,
	FieldErrors,
	PersonalDetails,
	Eligibility,
	SubmitStatus,
	WizardFormData,
	WizardStep,
} from '../types';

export type WizardState = {
	currentStep: WizardStep;
	formData: WizardFormData;
	errors: FieldErrors;
	submitStatus: SubmitStatus;
	submitError: string | null;
	submittedApplicationId: string | null;
};

export type WizardAction =
	| {
			type: 'UPDATE_PERSONAL_FIELD';
			field: keyof PersonalDetails;
			value: string;
	  }
	| {
			type: 'UPDATE_ELIGIBILITY_FIELD';
			field: keyof Eligibility;
			value: string;
	  }
	| {
			type: 'UPDATE_DOCUMENT_NUMBER';
			documentType: string;
			value: string;
	  }
	| {
			type: 'GO_TO_STEP';
			step: WizardStep;
	  }
	| {
			type: 'SET_ERRORS';
			errors: FieldErrors;
	  }
	| {
			type: 'CLEAR_ERRORS';
	  }
	| {
			type: 'SUBMIT_STARTED';
	  }
	| {
			type: 'SUBMIT_SUCCEEDED';
			applicationId: string;
	  }
	| {
			type: 'SUBMIT_FAILED';
			message: string;
	  };

export const initialWizardState: WizardState = {
	currentStep: 'personal',
	formData: {
		personal: {
			firstName: '',
			lastName: '',
			email: '',
			dateOfBirth: '',
		},
		eligibility: {
			city: '',
			vehicleType: '',
		},
		documents: {},
	},
	errors: {},
	submitStatus: 'idle',
	submitError: null,
	submittedApplicationId: null,
};

function removeError(errors: FieldErrors, field: string): FieldErrors {
	const nextErrors = { ...errors };
	delete nextErrors[field];
	return nextErrors;
}

export function wizardReducer(
	state: WizardState,
	action: WizardAction,
): WizardState {
	switch (action.type) {
		case 'UPDATE_PERSONAL_FIELD':
			return {
				...state,
				formData: {
					...state.formData,
					personal: {
						...state.formData.personal,
						[action.field]: action.value,
					},
				},
				errors: removeError(state.errors, `personal.${action.field}`),
				submitError: null,
			};

		case 'UPDATE_ELIGIBILITY_FIELD':
			return {
				...state,
				formData: {
					...state.formData,
					eligibility: {
						...state.formData.eligibility,
						[action.field]: action.value,
					},
				},
				errors: removeError(state.errors, `eligibility.${action.field}`),
				submitError: null,
			};

		case 'UPDATE_DOCUMENT_NUMBER':
			return {
				...state,
				formData: {
					...state.formData,
					documents: {
						...state.formData.documents,
						[action.documentType]: {
							number: action.value,
						},
					},
				},
				errors: removeError(
					state.errors,
					`documents.${action.documentType}.number`,
				),
				submitError: null,
			};

		case 'GO_TO_STEP':
			return {
				...state,
				currentStep: action.step,
			};

		case 'SUBMIT_STARTED':
			return {
				...state,
				submitStatus: 'submitting',
				submitError: null,
			};

		case 'SUBMIT_SUCCEEDED':
			return {
				...state,
				currentStep: 'success',
				submitStatus: 'success',
				submitError: null,
				submittedApplicationId: action.applicationId,
			};

		case 'SUBMIT_FAILED':
			return {
				...state,
				submitStatus: 'idle',
				submitError: action.message,
			};

		case 'SET_ERRORS':
			return {
				...state,
				errors: action.errors,
				submitStatus: 'idle',
				submitError: null,
			};

		case 'CLEAR_ERRORS':
			return {
				...state,
				errors: {},
			};

		default:
			return state;
	}
}

export function getDocumentNumber(
	documents: DocumentFormFields,
	documentType: string,
): string {
	return documents[documentType]?.number ?? '';
}
