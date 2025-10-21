import React, { useState, useEffect } from 'react';
import Modal from './common/Modal';
import Input from './common/Input';
import Button from './common/Button';
import { Property, User, Message } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  agent: User;
  onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => void;
  currentUser: User | null;
}

const ContactAgentModal: React.FC<ContactAgentModalProps> = ({ isOpen, onClose, property, agent, onSendMessage, currentUser }) => {
  const { t } = useLanguage();
  
  const getDefaultMessage = () => {
    return t('contactAgentModal.defaultMessage', {
      propertyTitle: property.title,
      propertyLocation: `${property.neighborhood}, ${property.city}`
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: getDefaultMessage(),
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setFormData({
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '',
          message: getDefaultMessage()
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: getDefaultMessage()
        });
      }
    } else {
      // Reset submitted state when modal is closed
      setSubmitted(false);
    }
  }, [currentUser, isOpen, property, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageData = {
      propertyId: property.id,
      propertyTitle: property.title,
      agentUid: agent.uid,
      visitorName: formData.name,
      visitorEmail: formData.email,
      visitorPhone: formData.phone,
      message: formData.message,
    };
    onSendMessage(messageData);
    setSubmitted(true);
    setTimeout(() => {
        onClose();
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('contactAgentModal.title', {agentName: agent.name})}>
      {submitted ? (
         <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="mt-4 text-lg font-medium text-white">{t('contactAgentModal.messageSent')}</h3>
            <p className="mt-2 text-sm text-gray-300">{t('contactAgentModal.messageSuccess')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label={t('contactAgentModal.yourName')}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Input
                label={t('contactAgentModal.yourEmail')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
             <Input
                label={t('contactAgentModal.yourPhone')}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">{t('contactAgentModal.message')}</label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 bg-brand-dark border border-brand-card rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-white"
                    required
                />
            </div>
            <div className="pt-2">
                <Button type="submit" className="w-full">{t('contactAgentModal.send')}</Button>
            </div>
        </form>
      )}
    </Modal>
  );
};

export default ContactAgentModal;