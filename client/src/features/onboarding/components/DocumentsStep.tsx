import { getRequiredDocumentTypes } from '../config/documentRequirements';
import type {
	DocumentFormFields,
	FieldErrors,
	OnboardingConfig,
} from '../types';
import { getDocumentNumber } from '../state/wizardReducer';
import type { Ref } from 'react';

type DocumentsStepProps = {
	headingRef?: Ref<HTMLHeadingElement>;
	config: OnboardingConfig;
	vehicleType: string;
	documents: DocumentFormFields;
	errors: FieldErrors;
	submitError: string | null;
	isSubmitting: boolean;
	onDocumentChange: (documentType: string, value: string) => void;
	onBack: () => void;
	onSubmit: () => void;
};
export function DocumentsStep({
	headingRef,
	config,
	vehicleType,
	documents,
	errors,
	submitError,
	isSubmitting,
	onDocumentChange,
	onBack,
	onSubmit,
}: DocumentsStepProps) {
	const requiredDocumentTypes = getRequiredDocumentTypes(config, vehicleType);

	return (
		<section aria-labelledby='documents-title'>
			<h2 id='documents-title' ref={headingRef} className='step-title'>
				Documents
			</h2>

			{requiredDocumentTypes.length === 0 ? (
				<p>Select a vehicle type to see required documents.</p>
			) : (
				<div className='document-list'>
					{requiredDocumentTypes.map((documentType) => {
						const documentDefinition = config.documents[documentType];
						const label = documentDefinition?.label ?? documentType;
						const errorKey = `documents.${documentType}.number`;
						const errorId = `document-${documentType}-error`;

						return (
							<div key={documentType} className='document-field'>
								<label htmlFor={`document-${documentType}`}>
									{label} number
								</label>
								<input
									id={`document-${documentType}`}
									name={`document-${documentType}`}
									value={getDocumentNumber(documents, documentType)}
									aria-invalid={Boolean(errors[errorKey])}
									aria-describedby={errors[errorKey] ? errorId : undefined}
									onChange={(event) =>
										onDocumentChange(documentType, event.target.value)
									}
								/>
								{errors[errorKey] && (
									<p id={errorId} className='field-error'>
										{errors[errorKey]}
									</p>
								)}
							</div>
						);
					})}
				</div>
			)}

			{submitError && (
				<p className='form-error' role='alert'>
					{submitError}
				</p>
			)}

			<div className='button-row'>
				<button type='button' onClick={onBack} disabled={isSubmitting}>
					Back
				</button>
				<button type='button' onClick={onSubmit} disabled={isSubmitting}>
					{isSubmitting ? 'Submitting…' : 'Submit application'}
				</button>
			</div>
		</section>
	);
}
