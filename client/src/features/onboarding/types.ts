export type VehicleType = {
	id: string;
	label: string;
	requiredDocuments: string[];
};

export type DocumentDefinition = {
	label: string;
};

export type OnboardingConfig = {
	vehicleTypes: VehicleType[];
	documents: Record<string, DocumentDefinition>;
	cities: string[];
};

export type PersonalDetails = {
	firstName: string;
	lastName: string;
	email: string;
	dateOfBirth: string;
};

export type Eligibility = {
	city: string;
	vehicleType: string;
};

export type SubmitDocument = {
	type: string;
	number: string;
};

export type SavedApplication = {
	applicationId: string;
	personal: PersonalDetails;
	eligibility: Eligibility;
	documents: SubmitDocument[];
};

export type SubmitPayload = {
	personal: PersonalDetails;
	eligibility: Eligibility;
	documents: SubmitDocument[];
};

export type SubmitSuccessResponse = {
	status: 'submitted';
	applicationId: string;
};

export type ApiFieldError = {
	field: string;
	message: string;
};

export type ApiFieldErrorResponse = {
	errors: ApiFieldError[];
};

export type ApiMessageErrorResponse = {
	message: string;
};

export type ApiErrorResponse = ApiFieldErrorResponse | ApiMessageErrorResponse;

export type ApiError = {
	status: number;
	data: ApiErrorResponse;
};

export type WizardStep = 'personal' | 'eligibility' | 'documents' | 'success';

export type DocumentFormFields = Record<string, { number: string }>;

export type WizardFormData = {
	personal: PersonalDetails;
	eligibility: Eligibility;
	documents: DocumentFormFields;
};

export type FieldErrors = Record<string, string>;

export type SubmitStatus = 'idle' | 'submitting' | 'success';
