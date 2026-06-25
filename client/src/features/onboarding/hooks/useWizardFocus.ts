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

	const shouldFocusStepHeadingRef = useRef(false);
	const shouldFocusFirstErrorRef = useRef(false);

	const focusStepHeading = useCallback(() => {
		const heading = stepHeadingRef.current;

		if (!heading) {
			return;
		}

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
