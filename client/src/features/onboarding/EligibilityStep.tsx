import type { Eligibility, OnboardingConfig } from './types';

type EligibilityStepProps = {
	config: OnboardingConfig;
	values: Eligibility;
	onChange: (field: keyof Eligibility, value: string) => void;
	onBack: () => void;
	onNext: () => void;
};

export function EligibilityStep({
	config,
	values,
	onChange,
	onBack,
	onNext,
}: EligibilityStepProps) {
	return (
		<section aria-labelledby='eligibility-title'>
			<h2 id='eligibility-title'>Eligibility</h2>

			<div>
				<label htmlFor='city'>City</label>
				<select
					id='city'
					name='city'
					value={values.city}
					onChange={(event) => onChange('city', event.target.value)}
				>
					<option value=''>Select a city</option>
					{config.cities.map((city) => (
						<option key={city} value={city}>
							{city}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor='vehicleType'>Vehicle type</label>
				<select
					id='vehicleType'
					name='vehicleType'
					value={values.vehicleType}
					onChange={(event) => onChange('vehicleType', event.target.value)}
				>
					<option value=''>Select a vehicle</option>
					{config.vehicleTypes.map((vehicleType) => (
						<option key={vehicleType.id} value={vehicleType.id}>
							{vehicleType.label}
						</option>
					))}
				</select>
			</div>

			<div className='button-row'>
				<button type='button' onClick={onBack}>
					Back
				</button>
				<button type='button' onClick={onNext}>
					Continue
				</button>
			</div>
		</section>
	);
}
