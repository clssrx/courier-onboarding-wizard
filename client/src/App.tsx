import { OnboardingWizard } from './features/onboarding/OnboardingWizard';
import { useOnboardingConfig } from './features/onboarding/hooks/useOnboardingConfig';

function App() {
	const { status, config, error } = useOnboardingConfig();

	return (
		<main className='app'>
			<h1>Courier Onboarding</h1>

			{status === 'loading' && <p>Loading onboarding configuration…</p>}

			{status === 'error' && <p>{error}</p>}

			{status === 'success' && <OnboardingWizard config={config} />}
		</main>
	);
}

export default App;
