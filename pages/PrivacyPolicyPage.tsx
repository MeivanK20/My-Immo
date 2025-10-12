import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicyPage: React.FC = () => {
  const { t, locale } = useLanguage();
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-dark">{t('privacyPage.title')}</h1>
          <p className="text-lg text-gray-600 mt-2">{t('privacyPage.lastUpdated', { date: new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US') })}</p>
          <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
        </div>

        <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            My Immo s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons et quels sont vos droits concernant vos données personnelles.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">1. Informations que nous collectons</h2>
          <p>
            Nous collectons plusieurs types d'informations pour fournir et améliorer notre service :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Données d'identification personnelle :</strong> Lors de votre inscription, nous collectons votre nom, votre adresse e-mail et votre rôle (visiteur ou agent).</li>
            <li><strong>Données des annonces :</strong> Si vous êtes un agent, nous collectons toutes les informations que vous fournissez sur les biens immobiliers, y compris les photos et vidéos.</li>
            <li><strong>Données d'utilisation :</strong> Nous pouvons collecter des informations sur la manière dont vous accédez et utilisez la plateforme (pages visitées, recherches effectuées).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">2. Comment nous utilisons vos informations</h2>
          <p>
            Les informations que nous collectons sont utilisées pour :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fournir, opérer et maintenir notre plateforme.</li>
            <li>Gérer votre compte et vous permettre d'utiliser nos fonctionnalités.</li>
            <li>Vous contacter concernant votre compte ou nos services.</li>
            <li>Améliorer et personnaliser votre expérience utilisateur.</li>
            <li>Assurer la sécurité de notre plateforme.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">3. Partage de vos informations</h2>
          <p>
            Nous ne vendons, n'échangeons ni ne louons vos informations d'identification personnelle à des tiers. Les informations de votre profil (nom) et les détails de vos annonces sont visibles publiquement par les autres utilisateurs de la plateforme, comme il se doit pour une plateforme d'annonces.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">4. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l'accès, la modification, la divulgation ou la destruction non autorisés. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100%.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">5. Vos droits</h2>
          <p>
            Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez exercer ces droits en nous contactant via notre page de contact.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">6. Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous notifierons de tout changement en publiant la nouvelle politique sur cette page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
