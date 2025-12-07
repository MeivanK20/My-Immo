/**
 * SETUP INSTRUCTIONS FOR MY IMMO
 * 
 * If you're seeing 404 errors when the app loads, it means the database tables
 * haven't been created in Supabase yet. Follow these steps:
 */

export const setupInstructions = {
  title: '⚠️ Supabase Database Setup Required',
  
  steps: [
    {
      step: 1,
      title: 'Open Supabase Dashboard',
      instructions: [
        'Go to https://supabase.com and log in',
        'Select your project "my-immo" or create one if needed'
      ]
    },
    {
      step: 2,
      title: 'Create Tables',
      instructions: [
        'Click on "SQL Editor" in the left sidebar',
        'Click "New Query" button',
        'Open the file: sql/SUPABASE_SCHEMA.sql (or SUPABASE_SCHEMA.sql in repo root)',
        'Copy all the SQL content',
        'Paste it into the SQL Editor',
        'Click "Run" button',
        'Wait for the tables to be created (should see success message)'
      ]
    },
    {
      step: 3,
      title: 'Seed Locality Data',
      instructions: [
        'Click "New Query" again',
        'Open the file: sql/localities_seed.sql',
        'Copy all the SQL content',
        'Paste it into a new SQL Editor query',
        'Click "Run" button'
      ]
    },
    {
      step: 4,
      title: 'Verify Setup',
      instructions: [
        'In Supabase Dashboard, go to "Table Editor"',
        'You should see tables: users, properties, regions, cities, neighborhoods',
        'Click on each table to verify they have data',
        'Reload the My Immo app in your browser - 404 errors should be gone!'
      ]
    }
  ],

  commonIssues: [
    {
      issue: '404 NOT_FOUND error when app loads',
      cause: 'Database tables (properties, regions, etc.) do not exist',
      solution: 'Run the SQL files from step 2 and 3 above'
    },
    {
      issue: 'OAuth/Google Sign-in not working',
      cause: 'Redirect URIs not configured for current dev port',
      solution: `In Supabase Dashboard > Authentication > Providers > Google:
        Add your current dev URL to redirect URIs, e.g.:
        - http://localhost:3003/auth/callback (or whatever port is shown when you run 'npm run dev')`
    },
    {
      issue: 'Can\'t create properties / Add Property page has errors',
      cause: 'Missing auth context or properties table not created',
      solution: 'Make sure you completed steps 1-3 and logged in with a valid account'
    }
  ],

  files: {
    schema: 'SUPABASE_SCHEMA.sql - Core database schema (run first)',
    localitiesSchema: 'sql/localities_schema.sql - Regions, cities, neighborhoods tables',
    localitiesSeed: 'sql/localities_seed.sql - Sample data for Cameroon locations',
    setup: 'SUPABASE_SETUP.md - Detailed setup instructions'
  },

  environment: {
    required: [
      'VITE_SUPABASE_URL - Your Supabase project URL',
      'VITE_SUPABASE_ANON_KEY - Your Supabase anon/public key'
    ],
    location: '.env file in project root',
    note: 'These should already be in .env if you got them from the project setup'
  }
};

// Setup instructions available in setupGuide export
