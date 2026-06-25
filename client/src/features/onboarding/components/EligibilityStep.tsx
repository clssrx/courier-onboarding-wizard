import { CityField } from './CityField';
import type { Eligibility, FieldErrors, OnboardingConfig } from '../types';
import type { Ref } from 'react';

type EligibilityStepProps = {
	headingRef?: Ref<HTMLHeadingElement>;
	config: OnboardingConfig;
	values: Eligibility;
	errors: FieldErrors;
	onChange: (field: keyof Eligibility, value: string) => void;
	onBack: () => void;
	onNext: () => void;
};

export function EligibilityStep({
	headingRef,
	config,
	values,
	errors,
	onChange,
	onBack,
	onNext,
}: EligibilityStepProps) {
	return (
		<section aria-labelledby='eligibility-title'>
			<h2 id='eligibility-title' ref={headingRef} className='step-title'>
				Eligibility
			</h2>

			<div>
				<CityField
					cities={config.cities}
					value={values.city}
					error={errors['eligibility.city']}
					onChange={(value) => onChange('city', value)}
				/>
			</div>

			<div>
				<label htmlFor='vehicleType'>Vehicle type</label>
				<select
					id='vehicleType'
					name='vehicleType'
					value={values.vehicleType}
					aria-invalid={Boolean(errors['eligibility.vehicleType'])}
					aria-describedby={
						errors['eligibility.vehicleType'] ? 'vehicleType-error' : undefined
					}
					onChange={(event) => onChange('vehicleType', event.target.value)}
				>
					<option value=''>Select a vehicle</option>
					{config.vehicleTypes.map((vehicleType) => (
						<option key={vehicleType.id} value={vehicleType.id}>
							{vehicleType.label}
						</option>
					))}
				</select>
				{errors['eligibility.vehicleType'] && (
					<p id='vehicleType-error' className='field-error'>
						{errors['eligibility.vehicleType']}
					</p>
				)}
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
