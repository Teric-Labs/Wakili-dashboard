# Wakili Dashboard

CTDR-U's internal admin dashboard for WakiliBot, Uganda's AI-assisted financial
consumer-protection service. Staff review and manage complaints, fraud
incidents, documents, and the Wakilibot AI agent's conversation activity.

## Features

- Complaint and fraud-incident case management, with status tracking
- Document archive (upload, metadata, download, statistics)
- Wakilibot AI agent monitoring: live session stream, intent precision,
  language distribution, and an escalation queue filter for sessions that
  need officer follow-up
- Audit logs and officer roster
- Channel overview (web, USSD, SMS, IVR)
- Staff-only login (role comes from the backend's staff-email allowlist)
- Responsive layouts, charts, notifications, and data grids

## Technology

React 19, Material UI, MUI X Data Grid, React Router, Recharts, and Axios.

## Getting started

Requires Node.js 18 or newer and npm.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

Copy `.env.example` to `.env` and set your backend URL:

```bash
cp .env.example .env
npm start
```

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_BACKEND_URL` | No | WakiliBot Core API base URL (default: hosted Render service) |
| `PORT` | No | Dev-server port (default: `3000`, set to `3001` to avoid clashing with the web app) |

All `REACT_APP_*` vars are baked into the bundle at build time by Create React App — they cannot be changed after the image is built.

## Testing

```bash
CI=true npm test -- --watchAll=false
```

37 tests across 6 suites: pure-function coverage for `src/utils/helpers.js`, one representative test per API resource group in `src/components/services/api.test.js`, and component tests for `OrdersComponent`, `Homepage`, and `Sidebar`. `npm test` alone launches Jest in interactive watch mode.

## Docker

The image is published to GHCR on every merge to `main`. Pull and run it directly:

```bash
docker run -p 3001:3000 ghcr.io/teric-labs/wakili-dashboard:latest
```

Pass `REACT_APP_BACKEND_URL` to point it at your backend:

```bash
docker run -e REACT_APP_BACKEND_URL=https://your-backend.onrender.com \
  -p 3001:3000 ghcr.io/teric-labs/wakili-dashboard:latest
```

### Build locally

```bash
docker build -t wakili-dashboard .
docker run -p 3001:3000 wakili-dashboard
```

This is a dev-server image (`npm start`), matching how the parent `phosai/docker-compose.yml` runs it — not a production static build.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
