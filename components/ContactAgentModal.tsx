
import React, { useState, useEffect } from 'react';
import Modal from './common/Modal';
import Input from './common/Input';
import Button from './common/Button';
import { Property, User, Message } from '../types';

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  agent: User;
  onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => void;
  currentUser: User | null;
}

const ContactAgentModal: React.FC<ContactAgentModalProps> = ({ isOpen, onClose, property, agent, onSendMessage, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Bonjour, je suis intéressé(e) par la propriété "${property.title}" située à ${property.neighborhood}, ${property.city}. Pourriez-vous me fournir plus d'informations ?`,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({ ...prev, name: currentUser.name, email: currentUser.email }));
    }
  }, [currentUser, isOpen]);

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
        setSubmitted(false);
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Contacter ${agent.name}`}>
      {submitted ? (
         <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Message Envoyé !</h3>
            <p className="mt-2 text-sm text-gray-600">L'agent a été notifié et vous répondra bientôt.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Votre Nom"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Input
                label="Votre Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
             <Input
                label="Votre Téléphone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                    required
                />
            </div>
            <div className="pt-2">
                <Button type="submit" className="w-full">Envoyer</Button>
            </div>
        </form>
      )}
    </Modal>
  );
};

export default ContactAgentModal;
