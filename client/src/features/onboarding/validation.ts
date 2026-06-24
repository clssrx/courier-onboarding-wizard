import type {
	DocumentFormFields,
	Eligibility,
	FieldErrors,
	OnboardingConfig,
	PersonalDetails,
} from './types';
import {
	getRequiredDocumentTypes,
	getSelectedVehicle,
} from './config/documentRequirements';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value: string): boolean {
	return value.trim().length === 0;
}

function isAtLeast18(dateOfBirth: string): boolean {
	if (!dateOfBirth) {
		return false;
	}

	const birthDate = new Date(`${dateOfBirth}T00:00:00`);

	if (Number.isNaN(birthDate.getTime())) {
		return false;
	}

	const eighteenthBirthday = new Date(birthDate);
	eighteenthBirthday.setFullYear(birthDate.getFullYear() + 18);

	return eighteenthBirthday <= new Date();
}

export function hasValidationErrors(errors: FieldErrors): boolean {
	return Object.keys(errors).length > 0;
}

export function validatePersonalDetails(
	personal: PersonalDetails,
): FieldErrors {
	const errors: FieldErrors = {};

	if (isBlank(personal.firstName)) {
		errors['personal.firstName'] = 'First name is required.';
	}

	if (isBlank(personal.lastName)) {
		errors['personal.lastName'] = 'Last name is required.';
	}

	if (isBlank(personal.email)) {
		errors['personal.email'] = 'Email is required.';
	} else if (!EMAIL_PATTERN.test(personal.email)) {
		errors['personal.email'] = 'Enter a valid email address.';
	}

	if (isBlank(personal.dateOfBirth)) {
		errors['personal.dateOfBirth'] = 'Date of birth is required.';
	} else if (!isAtLeast18(personal.dateOfBirth)) {
		errors['personal.dateOfBirth'] =
			'Applicants must be at least 18 years old.';
	}

	return errors;
}

export function validateEligibility(
	eligibility: Eligibility,
	config: OnboardingConfig,
): FieldErrors {
	const errors: FieldErrors = {};

	if (isBlank(eligibility.city)) {
		errors['eligibility.city'] = 'Select a city.';
	} else if (!config.cities.includes(eligibility.city)) {
		errors['eligibility.city'] = 'Select a city from the list.';
	}

	if (isBlank(eligibility.vehicleType)) {
		errors['eligibility.vehicleType'] = 'Select a vehicle type.';
	} else if (!getSelectedVehicle(config, eligibility.vehicleType)) {
		errors['eligibility.vehicleType'] = 'Select a valid vehicle type.';
	}

	return errors;
}

export function validateDocuments(
	documents: DocumentFormFields,
	config: OnboardingConfig,
	vehicleType: string,
): FieldErrors {
	const errors: FieldErrors = {};
	const requiredDocumentTypes = getRequiredDocumentTypes(config, vehicleType);

	requiredDocumentTypes.forEach((documentType) => {
		const documentNumber = documents[documentType]?.number ?? '';
		const documentLabel = config.documents[documentType]?.label ?? documentType;

		if (isBlank(documentNumber)) {
			errors[`documents.${documentType}.number`] =
				`${documentLabel} number is required.`;
		}
	});

	return errors;
}
