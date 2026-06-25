import type { FieldErrors, PersonalDetails } from '../types';
import type { Ref } from 'react';

type PersonalDetailsStepProps = {
	headingRef?: Ref<HTMLHeadingElement>;
	values: PersonalDetails;
	errors: FieldErrors;
	onChange: (field: keyof PersonalDetails, value: string) => void;
	onNext: () => void;
};

export function PersonalDetailsStep({
	headingRef,
	values,
	errors,
	onChange,
	onNext,
}: PersonalDetailsStepProps) {
	return (
		<section aria-labelledby='personal-details-title'>
			<h2 id='personal-details-title' ref={headingRef} className='step-title'>
				Personal details
			</h2>

			<div>
				<label htmlFor='firstName'>First name</label>
				<input
					id='firstName'
					name='firstName'
					value={values.firstName}
					maxLength={80}
					aria-invalid={Boolean(errors['personal.firstName'])}
					aria-describedby={
						errors['personal.firstName'] ? 'firstName-error' : undefined
					}
					onChange={(event) => onChange('firstName', event.target.value)}
				/>
				{errors['personal.firstName'] && (
					<p id='firstName-error' className='field-error'>
						{errors['personal.firstName']}
					</p>
				)}
			</div>

			<div>
				<label htmlFor='lastName'>Last name</label>
				<input
					id='lastName'
					name='lastName'
					value={values.lastName}
					maxLength={80}
					aria-invalid={Boolean(errors['personal.lastName'])}
					aria-describedby={
						errors['personal.lastName'] ? 'lastName-error' : undefined
					}
					onChange={(event) => onChange('lastName', event.target.value)}
				/>
				{errors['personal.lastName'] && (
					<p id='lastName-error' className='field-error'>
						{errors['personal.lastName']}
					</p>
				)}
			</div>

			<div>
				<label htmlFor='email'>Email</label>
				<input
					id='email'
					name='email'
					type='email'
					value={values.email}
					maxLength={254}
					aria-invalid={Boolean(errors['personal.email'])}
					aria-describedby={
						errors['personal.email'] ? 'email-error' : undefined
					}
					onChange={(event) => onChange('email', event.target.value)}
				/>
				{errors['personal.email'] && (
					<p id='email-error' className='field-error'>
						{errors['personal.email']}
					</p>
				)}
			</div>

			<div>
				<label htmlFor='dateOfBirth'>Date of birth</label>
				<input
					id='dateOfBirth'
					name='dateOfBirth'
					type='date'
					value={values.dateOfBirth}
					aria-invalid={Boolean(errors['personal.dateOfBirth'])}
					aria-describedby={
						errors['personal.dateOfBirth'] ? 'dateOfBirth-error' : undefined
					}
					onChange={(event) => onChange('dateOfBirth', event.target.value)}
				/>
				{errors['personal.dateOfBirth'] && (
					<p id='dateOfBirth-error' className='field-error'>
						{errors['personal.dateOfBirth']}
					</p>
				)}
			</div>

			<div className='button-row'>
				<button type='button' onClick={onNext}>
					Continue
				</button>
			</div>
		</section>
	);
}
