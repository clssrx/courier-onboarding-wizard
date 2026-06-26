import {
	fireEvent,
	render,
	screen,
	waitFor,
	cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OnboardingWizard } from './OnboardingWizard';
import type { OnboardingConfig } from './types';

const testConfig: OnboardingConfig = {
	vehicleTypes: [
		{
			id: 'bicycle',
			label: 'Bicycle',
			requiredDocuments: ['id_document'],
		},
		{
			id: 'scooter',
			label: 'Motor Scooter',
			requiredDocuments: [
				'id_document',
				'drivers_license',
				'vehicle_insurance',
			],
		},
	],
	documents: {
		id_document: {
			label: 'ID Document',
		},
		drivers_license: {
			label: "Driver's Licence",
		},
		vehicle_insurance: {
			label: 'Vehicle Insurance',
		},
	},
	cities: ['Berlin', 'Hamburg', 'Faultown'],
};

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

function renderWizard() {
	return render(<OnboardingWizard config={testConfig} />);
}

async function fillPersonalDetails(user: ReturnType<typeof userEvent.setup>) {
	await user.type(screen.getByLabelText(/first name/i), 'Mara');
	await user.type(screen.getByLabelText(/last name/i), 'Voss');
	await user.type(screen.getByLabelText(/email/i), 'mara.voss@example.com');

	fireEvent.change(screen.getByLabelText(/date of birth/i), {
		target: { value: '1996-04-12' },
	});
}

async function completePersonalStep(user: ReturnType<typeof userEvent.setup>) {
	await fillPersonalDetails(user);
	await user.click(screen.getByRole('button', { name: /continue/i }));
}

async function completeEligibilityStep(
	user: ReturnType<typeof userEvent.setup>,
	vehicleType = 'bicycle',
) {
	await user.type(screen.getByLabelText(/city/i), 'Berlin');
	await user.selectOptions(screen.getByLabelText(/vehicle/i), vehicleType);
	await user.click(screen.getByRole('button', { name: /continue/i }));
}

function getUnderageDateOfBirth(): string {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 17);

	return date.toISOString().slice(0, 10);
}

function mockSubmitError(
	status: number,
	data: {
		errors?: Array<{ field: string; message: string }>;
		message?: string;
	},
) {
	const fetchMock = vi.fn().mockResolvedValue({
		ok: false,
		status,
		json: async () => data,
	});

	vi.stubGlobal('fetch', fetchMock);

	return fetchMock;
}

describe('OnboardingWizard', () => {
	describe('document requirements', () => {
		it('updates the required document fields from the selected vehicle config', async () => {
			const user = userEvent.setup();

			renderWizard();

			await completePersonalStep(user);
			await completeEligibilityStep(user, 'bicycle');

			expect(screen.getByLabelText(/id document/i)).toBeInTheDocument();
			expect(screen.queryByLabelText(/driver/i)).not.toBeInTheDocument();
			expect(
				screen.queryByLabelText(/vehicle insurance/i),
			).not.toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: /back/i }));
			await user.selectOptions(screen.getByLabelText(/vehicle/i), 'scooter');
			await user.click(screen.getByRole('button', { name: /continue/i }));

			expect(screen.getByLabelText(/id document/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/driver/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/vehicle insurance/i)).toBeInTheDocument();
			expect(
				screen.queryByLabelText(/vehicle registration number/i),
			).not.toBeInTheDocument();
		});
	});

	describe('step validation', () => {
		it('validates personal details before advancing', async () => {
			const user = userEvent.setup();

			renderWizard();

			await user.click(screen.getByRole('button', { name: /continue/i }));

			expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
			expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
			expect(screen.getByText(/email is required/i)).toBeInTheDocument();
			expect(
				screen.getByText(/date of birth is required/i),
			).toBeInTheDocument();

			expect(
				screen.queryByRole('heading', { name: /eligibility/i }),
			).not.toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByLabelText(/first name/i)).toHaveFocus();
			});
		});

		it('validates email format and minimum age before advancing', async () => {
			const user = userEvent.setup();

			renderWizard();

			await user.type(screen.getByLabelText(/first name/i), 'Mara');
			await user.type(screen.getByLabelText(/last name/i), 'Voss');
			await user.type(screen.getByLabelText(/email/i), 'not-an-email');

			fireEvent.change(screen.getByLabelText(/date of birth/i), {
				target: { value: getUnderageDateOfBirth() },
			});

			await user.click(screen.getByRole('button', { name: /continue/i }));

			expect(
				screen.getByText(/enter a valid email address/i),
			).toBeInTheDocument();

			expect(
				screen.getByText(/applicants must be at least 18 years old/i),
			).toBeInTheDocument();

			expect(
				screen.queryByRole('heading', { name: /eligibility/i }),
			).not.toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByLabelText(/email/i)).toHaveFocus();
			});
		});
	});

	describe('submit error handling', () => {
		it('maps a 422 server error back to the matching field and step', async () => {
			const user = userEvent.setup();

			mockSubmitError(422, {
				errors: [
					{
						field: 'personal.email',
						message: 'This email cannot be used.',
					},
				],
			});

			renderWizard();

			await completePersonalStep(user);
			await completeEligibilityStep(user, 'bicycle');

			await user.type(screen.getByLabelText(/id document/i), 'ID-123');
			await user.click(screen.getByRole('button', { name: /submit/i }));

			expect(
				await screen.findByRole('heading', { name: /personal details/i }),
			).toBeInTheDocument();

			expect(
				screen.getByText(/this email cannot be used/i),
			).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByLabelText(/email/i)).toHaveFocus();
			});
		});

		it('maps a 409 duplicate document error back to the matching document field', async () => {
			const user = userEvent.setup();

			mockSubmitError(409, {
				errors: [
					{
						field: 'documents.drivers_license.number',
						message: "This driver's licence is already on file.",
					},
				],
			});

			renderWizard();

			await completePersonalStep(user);
			await completeEligibilityStep(user, 'scooter');

			await user.type(screen.getByLabelText(/id document/i), 'ID-123');
			await user.type(screen.getByLabelText(/driver/i), 'DUPLICATE');
			await user.type(screen.getByLabelText(/vehicle insurance/i), 'INS-123');

			await user.click(screen.getByRole('button', { name: /submit/i }));

			expect(
				await screen.findByRole('heading', { name: /documents/i }),
			).toBeInTheDocument();
			expect(await screen.findByText(/already on file/i)).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByLabelText(/driver's licence/i)).toHaveFocus();
			});
		});
	});
});
