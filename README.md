# Courier Onboarding Wizard

A React + TypeScript multi-step onboarding wizard for prospective couriers. The app loads onboarding configuration from the provided mock API, validates each step, renders required documents based on the selected vehicle type, and maps submit errors back to the correct fields and steps.

## Running the project

From the repository root:

```bash
npm install
npm run dev
```

This starts both the mock API and the client:

- Mock API: `http://localhost:4000`
- Client: served by Vite

Other commands:

```bash
npm run dev:api      # start only the mock API
npm run dev:client   # start only the client
npm test             # run tests
npm run build        # check production build
```

The root `npm run dev` command uses `concurrently` to start the mock API and the Vite client together. I chose this lightweight setup instead of Docker or a Makefile because the mock API has no dependencies, and npm scripts are enough to run both parts in one step.

## Tech stack

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- Plain CSS

## Architecture

The onboarding flow is organised as a feature under `features/onboarding`.

The main pieces are:

- `OnboardingWizard.tsx`: coordinates the wizard flow
- `state/wizardReducer.ts`: manages local wizard state
- `validation.ts`: handles client-side validation
- `submission/`: builds the submit payload and maps API errors
- `hooks/useWizardFocus.ts`: handles focus after navigation and errors
- `components/`: renders the individual wizard steps

I used `useReducer` because the wizard has related local state transitions: field updates, step navigation, validation errors, and submit state. I did not add Redux, Zustand, or Context because the state is local to this feature and only passed to direct child components.

## Key behaviour

### Config-driven documents

The document step is driven by the API config. Each vehicle type has a `requiredDocuments` array, and the documents shown in step 3 come from the currently selected vehicle.

Changing the vehicle type changes the required document fields. The submit payload is also built from the currently required document types, so hidden document values are not submitted.

### Validation

Each step is validated before the user can continue.

Client-side validation covers:

- required fields
- email format
- minimum age of 18
- selected city exists in the API city list
- selected vehicle type exists in the API config
- required document numbers are present

Errors are shown at field level and associated with their inputs using `aria-describedby`.

### Submit errors

The app handles submit responses from the mock API:

- `200`: shows a success confirmation
- `422`: maps server validation errors back to the correct field and step
- `409`: maps conflict errors, such as duplicate document numbers, to the relevant field
- `503`: shows a retryable general error without losing user input

Because server errors can refer to fields on previous steps, the wizard navigates to the step containing the error and focuses the invalid field.

## Accessibility

The flow uses semantic form controls with visible labels. Field errors are associated with inputs through `aria-describedby`, and invalid inputs use `aria-invalid`.

Focus is managed explicitly:

- successful step navigation moves focus to the new step heading
- validation and server field errors move focus to the first invalid field
- successful submission moves focus to the success heading, which is associated with the confirmation message

I kept the native date input for date of birth because it provides a clean browser UI and keeps the value in the API-friendly `YYYY-MM-DD` format. A production version would need broader testing across browser and screen reader combinations, since native date picker accessibility can vary.

## Long city list

The city list is intentionally large. To keep typing responsive, the city field uses a controlled input with filtered `datalist` suggestions and limits the number of rendered options.

The selected city is still validated against the full API-provided city list.

This is a lightweight solution for the exercise. In production, I would consider a fully tested accessible combobox or virtualised city picker, since `datalist` behaviour can vary across browsers and assistive technologies.

## Styling and responsiveness

The UI uses plain CSS with a small Just Eat-inspired orange palette, a white card layout, rounded form controls, visible focus states, and responsive spacing.

I chose plain CSS instead of PIE to keep the exercise focused on the wizard logic, accessibility, and API behaviour. PIE was optional in the brief, and using it would have added React/web-component integration work that was not necessary for this small flow.

I treated mobile as an important use case because courier onboarding is likely to happen on phones as well as desktops. On small screens, the form keeps full-width fields, large touch targets, stacked buttons, and enough spacing for validation messages without making the layout feel cramped.

## Tests

The test suite focuses on the main product logic:

- config-driven document rendering
- required field validation before advancing
- email format and minimum-age validation
- mapping `422` server errors back to the correct field and step
- mapping `409` duplicate document errors back to the relevant document field

## Tradeoffs

I did not implement the optional resume flow, custom accessible combobox, virtualised city list, live-region announcement system, or visible progress indicator. I focused on the required wizard behaviour, field-level error handling, accessibility basics, responsive layout, city-list performance, and meaningful tests.
