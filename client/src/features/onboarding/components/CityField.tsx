import { useDeferredValue, useMemo } from 'react';

const MAX_VISIBLE_CITY_OPTIONS = 50;

type CityFieldProps = {
	cities: string[];
	value: string;
	error?: string;
	onChange: (value: string) => void;
};

export function CityField({ cities, value, error, onChange }: CityFieldProps) {
	const deferredValue = useDeferredValue(value);

	const visibleCities = useMemo(() => {
		const normalizedQuery = deferredValue.trim().toLowerCase();

		if (!normalizedQuery) {
			return cities.slice(0, MAX_VISIBLE_CITY_OPTIONS);
		}

		return cities
			.filter((city) => city.toLowerCase().includes(normalizedQuery))
			.slice(0, MAX_VISIBLE_CITY_OPTIONS);
	}, [cities, deferredValue]);

	return (
		<div>
			<label htmlFor='city'>City</label>
			<input
				id='city'
				name='city'
				list='city-options'
				value={value}
				autoComplete='off'
				aria-invalid={Boolean(error)}
				aria-describedby={error ? 'city-error city-help' : 'city-help'}
				onChange={(event) => onChange(event.target.value)}
			/>

			<datalist id='city-options'>
				{visibleCities.map((city) => (
					<option key={city} value={city} />
				))}
			</datalist>

			<p id='city-help' className='field-hint'>
				Start typing to search the available cities.
			</p>

			{error && (
				<p id='city-error' className='field-error'>
					{error}
				</p>
			)}
		</div>
	);
}
