import { OnboardingWizard } from './features/onboarding/OnboardingWizard';
import { useOnboardingConfig } from './features/onboarding/hooks/useOnboardingConfig';

function App() {
	const { status, config, error } = useOnboardingConfig();

	return (
		<main className='app'>
			<h1>Courier Onboarding</h1>

			{status === 'loading' && (
				<section className='app-state' aria-labelledby='loading-title'>
					<h2 id='loading-title'>Loading form</h2>
					<p role='status'>Loading onboarding configuration…</p>
				</section>
			)}

			{status === 'error' && (
				<section
					className='app-state'
					aria-labelledby='config-error-title'
					role='alert'
				>
					<h2 id='config-error-title'>We couldn't load the onboarding form</h2>
					<p>{error}</p>
				</section>
			)}

			{status === 'success' && <OnboardingWizard config={config} />}
		</main>
	);
}

export default App;
