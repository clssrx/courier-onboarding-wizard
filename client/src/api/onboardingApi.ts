import type {
	ApiError,
	ApiErrorResponse,
	OnboardingConfig,
	SavedApplication,
	SubmitPayload,
	SubmitSuccessResponse,
} from '../features/onboarding/types';

const API_BASE_URL = 'http://localhost:4000';

async function fetchJson<TResponse>(
	path: string,
	options?: RequestInit,
): Promise<TResponse> {
	const response = await fetch(`${API_BASE_URL}${path}`, options);
	const data = await response.json();

	if (!response.ok) {
		const apiError: ApiError = {
			status: response.status,
			data: data as ApiErrorResponse,
		};

		throw apiError;
	}

	return data as TResponse;
}

export function getOnboardingConfig(): Promise<OnboardingConfig> {
	return fetchJson<OnboardingConfig>('/onboarding/config');
}

export function getSavedApplication(
	applicationId: string,
): Promise<SavedApplication> {
	return fetchJson<SavedApplication>(
		`/onboarding/applications/${encodeURIComponent(applicationId)}`,
	);
}

export function submitApplication(
	applicationId: string,
	payload: SubmitPayload,
): Promise<SubmitSuccessResponse> {
	return fetchJson<SubmitSuccessResponse>(
		`/onboarding/applications/${encodeURIComponent(applicationId)}/submit`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		},
	);
}
