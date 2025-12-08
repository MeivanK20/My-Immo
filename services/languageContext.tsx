// Language support removed. Site is French-only.
// Provide a tiny stub so existing imports do not break.
export const LanguageProvider = ({ children }: any) => {
  return <>{children}</>;
};

export const useLanguage = () => ({
  language: 'fr' as const,
  setLanguage: (_: 'fr') => {},
  t: (k: string) => k,
});
