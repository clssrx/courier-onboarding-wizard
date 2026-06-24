import type { OnboardingConfig, SubmitPayload, WizardFormData } from './types';
import { getRequiredDocumentTypes } from './documentRequirements';

export function buildSubmitPayload(
	formData: WizardFormData,
	config: OnboardingConfig,
): SubmitPayload {
	const requiredDocumentTypes = getRequiredDocumentTypes(
		config,
		formData.eligibility.vehicleType,
	);

	return {
		personal: {
			firstName: formData.personal.firstName.trim(),
			lastName: formData.personal.lastName.trim(),
			email: formData.personal.email.trim(),
			dateOfBirth: formData.personal.dateOfBirth,
		},
		eligibility: {
			city: formData.eligibility.city,
			vehicleType: formData.eligibility.vehicleType,
		},
		documents: requiredDocumentTypes.map((documentType) => ({
			type: documentType,
			number: formData.documents[documentType]?.number.trim() ?? '',
		})),
	};
}
