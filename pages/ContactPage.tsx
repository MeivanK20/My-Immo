import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { createZendeskTicket } from '../services/zendeskService';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSubmitted(false);

    try {
      await createZendeskTicket(formState);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(t('contactPage.sendError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">{t('contactPage.title')}</h1>
        <p className="text-lg text-gray-400 mt-2">{t('contactPage.subtitle')}</p>
        <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-brand-card p-8 rounded-lg shadow-lg">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {t('contactPage.email')}
            </h3>
            <p className="text-gray-300 mt-1">mbaye.ivan@outlook.com</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {t('contactPage.phone')}
            </h3>
            <p className="text-gray-300 mt-1">(+237) 655 886 086</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {t('contactPage.address')}
            </h3>
            <p className="text-gray-300 mt-1">{t('contactPage.addressValue')}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-green-500/20 border-l-4 border-green-400 text-green-200 p-4 rounded-md" role="alert">
              <p className="font-bold">{t('contactPage.messageSent')}</p>
              <p>{t('contactPage.messageSentSuccess')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">{error}</div>}
              <Input label={t('contactPage.yourName')} name="name" type="text" value={formState.name} onChange={handleChange} required disabled={isLoading} />
              <Input label={t('contactPage.yourEmail')} name="email" type="email" value={formState.email} onChange={handleChange} required disabled={isLoading} />
              <Input label={t('contactPage.subject')} name="subject" type="text" value={formState.subject} onChange={handleChange} required disabled={isLoading} />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">{t('contactPage.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 bg-brand-dark border border-brand-card rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-white disabled:bg-brand-card"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('contactPage.sending') : t('contactPage.sendMessage')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
