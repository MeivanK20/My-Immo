import React from 'react';
import { Message } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MessagesPageProps {
  messages: Message[];
}

const MessagesPage: React.FC<MessagesPageProps> = ({ messages }) => {
  const { t, locale } = useLanguage();
  const sortedMessages = [...messages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">{t('messagesPage.title')}</h1>
      {sortedMessages.length > 0 ? (
        <div className="space-y-6">
          {sortedMessages.map(msg => (
            <div key={msg.id} className="bg-brand-card p-6 rounded-lg shadow-lg border-l-4 border-brand-red">
              <div className="flex flex-wrap justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg text-white">
                    {t('messagesPage.subject')}{' '}
                    <span className="font-normal">{msg.propertyTitle}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    {t('messagesPage.receivedOn')}{' '}
                    {new Date(msg.timestamp).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                  </p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="font-semibold text-white">{msg.visitorName}</p>
                  <a href={`mailto:${msg.visitorEmail}`} className="text-blue-400 hover:underline text-sm">{msg.visitorEmail}</a><br/>
                  <a href={`tel:${msg.visitorPhone}`} className="text-blue-400 hover:underline text-sm">{msg.visitorPhone}</a>
                </div>
              </div>
              <div className="bg-brand-dark/50 p-4 rounded-md mt-4">
                <p className="text-gray-300 whitespace-pre-line">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-card rounded-lg shadow-md">
            <p className="text-xl text-gray-400">{t('messagesPage.noMessages')}</p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
