import { useReducer } from 'react';
import type { OnboardingConfig } from './types';
import { DocumentsStep } from './DocumentsStep';
import { EligibilityStep } from './EligibilityStep';
import { PersonalDetailsStep } from './PersonalDetailsStep';
import { initialWizardState, wizardReducer } from './wizardReducer';

type OnboardingWizardProps = {
	config: OnboardingConfig;
};

export function OnboardingWizard({ config }: OnboardingWizardProps) {
	const [state, dispatch] = useReducer(wizardReducer, initialWizardState);

	const { currentStep, formData } = state;

	return (
		<div>
			<p>
				Step{' '}
				{currentStep === 'personal'
					? '1'
					: currentStep === 'eligibility'
						? '2'
						: '3'}{' '}
				of 3
			</p>

			{currentStep === 'personal' && (
				<PersonalDetailsStep
					values={formData.personal}
					onChange={(field, value) =>
						dispatch({ type: 'UPDATE_PERSONAL_FIELD', field, value })
					}
					onNext={() => dispatch({ type: 'GO_TO_STEP', step: 'eligibility' })}
				/>
			)}

			{currentStep === 'eligibility' && (
				<EligibilityStep
					config={config}
					values={formData.eligibility}
					onChange={(field, value) =>
						dispatch({ type: 'UPDATE_ELIGIBILITY_FIELD', field, value })
					}
					onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'personal' })}
					onNext={() => dispatch({ type: 'GO_TO_STEP', step: 'documents' })}
				/>
			)}

			{currentStep === 'documents' && (
				<DocumentsStep
					config={config}
					vehicleType={formData.eligibility.vehicleType}
					documents={formData.documents}
					onDocumentChange={(documentType, value) =>
						dispatch({
							type: 'UPDATE_DOCUMENT_NUMBER',
							documentType,
							value,
						})
					}
					onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'eligibility' })}
				/>
			)}
		</div>
	);
}
