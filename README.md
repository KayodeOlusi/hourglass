# Hourglass

Mobile app for Hourglass: reliable event reminders with session-linked notes. Built with Expo (SDK 57) and Expo Router; iOS first.

## Setup

```sh
nvm use          # Node 22.18 (Expo SDK 57 needs Node >= 22.13)
yarn install
cp .env.example .env.local   # then fill in the values
yarn ios         # or: yarn android
```

## Scripts

- `yarn start`: start the Metro dev server
- `yarn typecheck`: run the TypeScript check
- `yarn lint`: run ESLint

## Structure

```
src/
  app/          routes (Expo Router); screens and layouts only
    (tabs)/     Events, Notes, Activity, Profile
  components/
    global/     reusable components, one folder each (global/text/index.tsx)
  hooks/api/    hooks that make API requests; screens destructure from these
  lib/          device info, OAuth provider sign-in (Apple, Google)
  services/
    http/       axios client: auth header, token refresh on 401
    endpoints/  API paths per domain
    requests/   API calls per domain
    types/      request and response types
  store/        app state (session)
  theme/        design tokens (colors, type, radius, spacing) + useTheme
```
