import type {
	DocumentFormFields,
	FieldErrors,
	PersonalDetails,
	Eligibility,
	WizardFormData,
	WizardStep,
} from './types';

export type WizardState = {
	currentStep: WizardStep;
	formData: WizardFormData;
	errors: FieldErrors;
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
			};

		case 'GO_TO_STEP':
			return {
				...state,
				currentStep: action.step,
			};

		case 'SET_ERRORS':
			return {
				...state,
				errors: action.errors,
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
