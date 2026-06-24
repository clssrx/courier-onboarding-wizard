import type { PersonalDetails } from './types';

type PersonalDetailsStepProps = {
	values: PersonalDetails;
	onChange: (field: keyof PersonalDetails, value: string) => void;
	onNext: () => void;
};

export function PersonalDetailsStep({
	values,
	onChange,
	onNext,
}: PersonalDetailsStepProps) {
	return (
		<section aria-labelledby='personal-details-title'>
			<h2 id='personal-details-title'>Personal details</h2>

			<div>
				<label htmlFor='firstName'>First name</label>
				<input
					id='firstName'
					name='firstName'
					value={values.firstName}
					onChange={(event) => onChange('firstName', event.target.value)}
				/>
			</div>

			<div>
				<label htmlFor='lastName'>Last name</label>
				<input
					id='lastName'
					name='lastName'
					value={values.lastName}
					onChange={(event) => onChange('lastName', event.target.value)}
				/>
			</div>

			<div>
				<label htmlFor='email'>Email</label>
				<input
					id='email'
					name='email'
					type='email'
					value={values.email}
					onChange={(event) => onChange('email', event.target.value)}
				/>
			</div>

			<div>
				<label htmlFor='dateOfBirth'>Date of birth</label>
				<input
					id='dateOfBirth'
					name='dateOfBirth'
					type='date'
					value={values.dateOfBirth}
					onChange={(event) => onChange('dateOfBirth', event.target.value)}
				/>
			</div>

			<button type='button' onClick={onNext}>
				Continue
			</button>
		</section>
	);
}
