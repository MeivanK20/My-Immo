
import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message, subject } = formState;
    const mailtoLink = `mailto:mbaye.ivan@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-dark">Contactez-nous</h1>
        <p className="text-lg text-gray-600 mt-2">Nous sommes là pour répondre à toutes vos questions.</p>
        <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-lg">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-brand-dark flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email
            </h3>
            <p className="text-gray-600 mt-1">mbaye.ivan@outlook.com</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-dark flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Téléphone
            </h3>
            <p className="text-gray-600 mt-1">(+237) 655 886 086</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-dark flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Adresse
            </h3>
            <p className="text-gray-600 mt-1">123 Rue de l'Immobilier, Douala, Cameroun</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Message envoyé!</p>
              <p>Merci de nous avoir contactés. Votre client de messagerie devrait s'ouvrir.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Votre Nom" name="name" type="text" value={formState.name} onChange={handleChange} required />
              <Input label="Votre Email" name="email" type="email" value={formState.email} onChange={handleChange} required />
              <Input label="Sujet" name="subject" type="text" value={formState.subject} onChange={handleChange} required />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Envoyer le message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;