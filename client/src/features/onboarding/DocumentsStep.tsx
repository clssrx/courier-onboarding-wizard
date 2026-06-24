import type { DocumentFormFields, OnboardingConfig } from './types';
import { getDocumentNumber } from './wizardReducer';

type DocumentsStepProps = {
	config: OnboardingConfig;
	vehicleType: string;
	documents: DocumentFormFields;
	onDocumentChange: (documentType: string, value: string) => void;
	onBack: () => void;
};

export function DocumentsStep({
	config,
	vehicleType,
	documents,
	onDocumentChange,
	onBack,
}: DocumentsStepProps) {
	const selectedVehicle = config.vehicleTypes.find(
		(vehicle) => vehicle.id === vehicleType,
	);

	const requiredDocumentTypes = selectedVehicle?.requiredDocuments ?? [];

	return (
		<section aria-labelledby='documents-title'>
			<h2 id='documents-title'>Documents</h2>

			{requiredDocumentTypes.length === 0 ? (
				<p>Select a vehicle type to see required documents.</p>
			) : (
				<div>
					{requiredDocumentTypes.map((documentType) => {
						const documentDefinition = config.documents[documentType];
						const label = documentDefinition?.label ?? documentType;

						return (
							<div key={documentType}>
								<label htmlFor={`document-${documentType}`}>
									{label} number
								</label>
								<input
									id={`document-${documentType}`}
									name={`document-${documentType}`}
									value={getDocumentNumber(documents, documentType)}
									onChange={(event) =>
										onDocumentChange(documentType, event.target.value)
									}
								/>
							</div>
						);
					})}
				</div>
			)}

			<div className='button-row'>
				<button type='button' onClick={onBack}>
					Back
				</button>
				<button type='button'>Submit application</button>
			</div>
		</section>
	);
}
