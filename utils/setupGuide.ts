/**
 * SETUP INSTRUCTIONS FOR MY IMMO
 * 
 * If you're seeing 404 errors when the app loads, it may be because the
 * optional Supabase integration isn't configured. This project can run without
 * Supabase (it will use local fallbacks), but some features like persistent
 * properties and OAuth will not function until a backend is configured.
 */

export const setupInstructions = {
  title: '⚠️ Optional Supabase Integration (Not Required)',
  
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
      title: 'Run locally without Supabase',
      instructions: [
        'This app includes local fallbacks for auth and properties using localStorage',
        "Run 'npm install' and 'npm run dev'", 
        'Open the app and you can create properties locally (data stored in your browser)'
      ]
    }
  ],

  commonIssues: [
    {
      issue: 'App lacks persistent DB',
      cause: 'Supabase is not configured or removed',
      solution: 'The app will run with localStorage fallbacks; to enable a backend, re-add Supabase integration and configure your project'
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
