import { useCallback, useEffect, useRef } from 'react';
import type { FieldErrors, WizardStep } from '../types';
import { hasValidationErrors } from '../validation';

const INVALID_FIELD_SELECTOR =
	'input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"]';

type UseWizardFocusArgs = {
	currentStep: WizardStep;
	errors: FieldErrors;
};

export function useWizardFocus({ currentStep, errors }: UseWizardFocusArgs) {
	const wizardRef = useRef<HTMLDivElement>(null);
	const stepHeadingRef = useRef<HTMLHeadingElement>(null);

	// Focus targets may not exist until after React renders the next step
	// or the latest validation errors. These refs store the focus request
	// without causing another render.
	const shouldFocusStepHeadingRef = useRef(false);
	const shouldFocusFirstErrorRef = useRef(false);

	const focusStepHeading = useCallback(() => {
		const heading = stepHeadingRef.current;

		if (!heading) {
			return;
		}

		// Headings are not focusable by default. Adding tabindex="-1"
		// temporarily lets us move focus there programmatically without
		// putting the heading into the normal Tab order.
		heading.setAttribute('tabindex', '-1');
		heading.focus();

		heading.addEventListener(
			'blur',
			() => {
				heading.removeAttribute('tabindex');
			},
			{ once: true },
		);
	}, []);

	useEffect(() => {
		if (!shouldFocusStepHeadingRef.current) {
			return;
		}

		shouldFocusStepHeadingRef.current = false;
		focusStepHeading();
	}, [currentStep, focusStepHeading]);

	useEffect(() => {
		if (!shouldFocusFirstErrorRef.current) {
			return;
		}

		if (!hasValidationErrors(errors)) {
			return;
		}

		shouldFocusStepHeadingRef.current = false;

		// Validation and server errors mark controls with aria-invalid="true".
		// After the current step has rendered, the first invalid control becomes
		// the most useful focus target.
		const firstInvalidField = wizardRef.current?.querySelector<HTMLElement>(
			INVALID_FIELD_SELECTOR,
		);

		if (!firstInvalidField) {
			return;
		}

		shouldFocusFirstErrorRef.current = false;
		firstInvalidField.focus();
	}, [errors, currentStep]);

	const requestStepHeadingFocus = useCallback(() => {
		shouldFocusStepHeadingRef.current = true;
		shouldFocusFirstErrorRef.current = false;
	}, []);

	const requestFirstInvalidFieldFocus = useCallback(() => {
		shouldFocusFirstErrorRef.current = true;
		shouldFocusStepHeadingRef.current = false;
	}, []);

	return {
		wizardRef,
		stepHeadingRef,
		requestStepHeadingFocus,
		requestFirstInvalidFieldFocus,
	};
}
