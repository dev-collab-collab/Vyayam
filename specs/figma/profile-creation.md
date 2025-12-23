# Profile Creation Screen – VYAYAM-28

## Purpose
This screen is used to collect and submit user profile information
for users who have authenticated successfully but do not yet have
a profile.

The screen MUST be shown only when the backend indicates that no
profile exists for the authenticated user.

## When to Show
- Backend response: profileExists = false → show this screen
- Backend response: profileExists = true → skip this screen and go to Dashboard

## Platform
- Mobile-first UI
- Designed for iPhone 17 Pro resolution (430 × 932)
- Flat UI only (no device mockups)

## Layout
- Single-column layout
- Centered content
- Clean, minimal design
- Top logo: vyayam_rest_of_the_app.png
- Title: "Create your profile"
- Subtitle: "This helps us personalize your experience."

## Required Fields
All required fields must be clearly marked with an asterisk (*).

1. Nickname *
2. Email *
3. Age *
4. Height *
5. Weight *
6. Gender *

Gender is mandatory.

## Field Rules
- Use appropriate input types (numeric for age, height, weight)
- Show units inline (years, cm, kg)
- One field per row
- No goal-related fields

## Validation (Frontend)
Before submission:
- Block submission if any required field is missing
- Show inline error message below the field

## Error Handling
The UI must handle and display the following errors:

### Missing Required Fields
- Inline field-level error messages

### Backend Validation Errors
- Show inline errors if field-specific
- Otherwise show a form-level error banner

### Network or Server Errors
- Show a generic non-technical error message

## Submit Behavior
- Primary CTA: "Create profile"
- Button disabled until form is valid
- Show loading state on submit

## Success Behavior
- On successful profile creation, redirect immediately to Dashboard
- Do NOT show a success screen

## Out of Scope
- Profile editing
- Goal selection or setup
