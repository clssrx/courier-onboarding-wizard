import { useEffect, useState } from 'react';
import { getOnboardingConfig } from '../../../api/onboardingApi';
import type { OnboardingConfig } from '../types';

type ConfigState =
	| { status: 'loading'; config: null; error: null }
	| { status: 'success'; config: OnboardingConfig; error: null }
	| { status: 'error'; config: null; error: string };

export function useOnboardingConfig(): ConfigState {
	const [state, setState] = useState<ConfigState>({
		status: 'loading',
		config: null,
		error: null,
	});

	useEffect(() => {
		let isActive = true;

		getOnboardingConfig()
			.then((config) => {
				if (!isActive) return;

				setState({
					status: 'success',
					config,
					error: null,
				});
			})
			.catch(() => {
				if (!isActive) return;

				setState({
					status: 'error',
					config: null,
					error: 'Could not load onboarding configuration.',
				});
			});

		return () => {
			isActive = false;
		};
	}, []);

	return state;
}
