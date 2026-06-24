import type { OnboardingConfig, VehicleType } from './types';

export function getSelectedVehicle(
	config: OnboardingConfig,
	vehicleType: string,
): VehicleType | undefined {
	return config.vehicleTypes.find((vehicle) => vehicle.id === vehicleType);
}

export function getRequiredDocumentTypes(
	config: OnboardingConfig,
	vehicleType: string,
): string[] {
	return getSelectedVehicle(config, vehicleType)?.requiredDocuments ?? [];
}

export function getVehicleLabel(
	config: OnboardingConfig,
	vehicleType: string,
): string {
	return getSelectedVehicle(config, vehicleType)?.label ?? vehicleType;
}
