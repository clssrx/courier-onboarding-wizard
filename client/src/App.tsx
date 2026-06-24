import { useEffect, useState } from 'react';
import type { OnboardingConfig } from './features/onboarding/types';
import { getOnboardingConfig } from './api/onboardingApi';

function App() {
	const [config, setConfig] = useState<OnboardingConfig | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadConfig() {
			try {
				const fetchedConfig = await getOnboardingConfig();
				setConfig(fetchedConfig);
			} catch (error) {
				console.error('Error fetching onboarding config:', error);
				setError('Failed to fetch onboarding config');
			}
		}

		loadConfig();
	}, []);

	return (
		<main className='app'>
			<h1>Courier Onboarding</h1>

			{error && <p>{error}</p>}

			{config ? (
				<section>
					<h2>Config loaded</h2>
					<p>{config.vehicleTypes.length} vehicle types</p>
					<p>{config.cities.length} cities</p>
				</section>
			) : (
				<p>Loading config…</p>
			)}
		</main>
	);
}

export default App;
