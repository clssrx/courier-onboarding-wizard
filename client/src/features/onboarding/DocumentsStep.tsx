import { getRequiredDocumentTypes } from './documentRequirements';
import type {
	DocumentFormFields,
	FieldErrors,
	OnboardingConfig,
} from './types';
import { getDocumentNumber } from './wizardReducer';

type DocumentsStepProps = {
	config: OnboardingConfig;
	vehicleType: string;
	documents: DocumentFormFields;
	errors: FieldErrors;
	onDocumentChange: (documentType: string, value: string) => void;
	onBack: () => void;
	onSubmit: () => void;
};

export function DocumentsStep({
	config,
	vehicleType,
	documents,
	errors,
	onDocumentChange,
	onBack,
	onSubmit,
}: DocumentsStepProps) {
	const requiredDocumentTypes = getRequiredDocumentTypes(config, vehicleType);

	return (
		<section aria-labelledby='documents-title'>
			<h2 id='documents-title'>Documents</h2>

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

			<div className='button-row'>
				<button type='button' onClick={onBack}>
					Back
				</button>
				<button type='button' onClick={onSubmit}>
					Submit application
				</button>
			</div>
		</section>
	);
}
