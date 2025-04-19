# React Fluent UI App with GitHub Authentication

A React application using Fluent UI v9 and GitHub OAuth authentication.

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   - Copy `.env.example` to `.env`
   - Fill in your GitHub OAuth credentials:
     - Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
     - Create a new OAuth application
     - Set the Authorization callback URL to `http://localhost:3000/auth/callback`
     - Copy the Client ID and Client Secret to your `.env` file

4. Start the development server:

   ```bash
   npm start
   ```

5. In a separate terminal, start the API server:
   ```bash
   npm run server
   ```

## Security Note

Never commit your `.env` file to version control. The `.gitignore` file is configured to prevent this. Always use `.env.example` as a template for setting up your environment variables.

## Available Scripts

- `npm start` - Start the development server
- `npm run server` - Start the API server
- `npm run build` - Build the production bundle
- `npm test` - Run tests
