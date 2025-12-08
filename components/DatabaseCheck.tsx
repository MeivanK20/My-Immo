import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient';

export const DatabaseCheck: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Try a simple query to verify database is accessible
        const { error } = await supabase.from('properties').select('id').limit(1);
        
        if (error && error.code === 'PGRST116') {
          // Table does not exist
          setHasError(true);
          setErrorMessage('The "properties" table does not exist in your Supabase database.');
        } else if (error) {
          setHasError(true);
          setErrorMessage(`Database error: ${error.message}`);
        }
      } catch (err: any) {
        setHasError(true);
        setErrorMessage(err?.message || 'Unknown database error');
      } finally {
        setIsChecking(false);
      }
    };

    checkDatabase();
  }, []);

  if (isChecking || !hasError) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b-2 border-red-500 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div className="flex-grow">
            <h3 className="font-bold text-red-900 mb-2">Database Setup Required</h3>
            <p className="text-red-700 text-sm mb-3">
              {errorMessage}
            </p>
            <ol className="text-red-700 text-sm space-y-1 list-decimal list-inside">
              <li>Open <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Supabase Dashboard</a></li>
              <li>Go to <strong>SQL Editor</strong> → <strong>New Query</strong></li>
              <li>Copy content from <code className="bg-red-100 px-1 rounded">SUPABASE_SCHEMA.sql</code> in your project</li>
              <li>Paste into SQL Editor and click <strong>Run</strong></li>
              <li>Then run <code className="bg-red-100 px-1 rounded">sql/localities_seed.sql</code> for sample data</li>
              <li>Refresh this page</li>
            </ol>
            <p className="text-red-600 text-xs mt-3">
              See <strong>SUPABASE_SETUP.md</strong> in project root for detailed instructions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
