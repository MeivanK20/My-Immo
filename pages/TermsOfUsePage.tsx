import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TermsOfUsePage: React.FC = () => {
  const { t, locale } = useLanguage();
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-dark">{t('termsPage.title')}</h1>
          <p className="text-lg text-gray-600 mt-2">{t('termsPage.lastUpdated', { date: new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US') })}</p>
          <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
        </div>

        <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Bienvenue sur My Immo. En accédant à notre site web et en utilisant nos services, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (CGU). Veuillez les lire attentivement.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 1 : Objet</h2>
          <p>
            My Immo est une plateforme en ligne qui a pour but de faciliter la mise en relation entre des propriétaires ou agents immobiliers ("Annonceurs") souhaitant vendre ou louer des biens immobiliers au Cameroun, et des particuliers ("Visiteurs") à la recherche de tels biens.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 2 : Accès et Inscription</h2>
          <p>
            L'accès aux annonces est libre. Cependant, pour déposer une annonce ou accéder à certaines fonctionnalités, la création d'un compte utilisateur est requise. Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription. Vous êtes seul responsable de la confidentialité de votre mot de passe et de l'utilisation de votre compte.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 3 : Obligations des Annonceurs</h2>
          <p>
            En tant qu'Annonceur, vous vous engagez à :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Détenir tous les droits nécessaires pour vendre ou louer le bien immobilier proposé.</li>
            <li>Fournir des informations véridiques, précises et complètes sur le bien (description, prix, caractéristiques, photos).</li>
            <li>Ne pas publier de contenu illégal, trompeur ou portant atteinte aux droits de tiers.</li>
            <li>Retirer l'annonce dès que le bien n'est plus disponible.</li>
          </ul>
          <p>
            My Immo se réserve le droit de supprimer toute annonce ne respectant pas ces règles, sans préavis ni indemnité.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 4 : Responsabilité</h2>
          <p>
            My Immo agit en tant qu'intermédiaire technique et hébergeur de contenu. Nous ne sommes pas une agence immobilière et ne participons à aucune transaction entre les utilisateurs. Notre responsabilité ne saurait être engagée pour :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>L'exactitude, la légalité ou la qualité des annonces publiées.</li>
            <li>Les litiges, désaccords ou pertes financières pouvant survenir entre les utilisateurs.</li>
            <li>Les interruptions de service, bugs ou problèmes techniques liés à la plateforme.</li>
          </ul>
          <p>
            La plateforme est fournie "en l'état", sans aucune garantie expresse ou implicite.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 5 : Propriété Intellectuelle</h2>
          <p>
            Tous les éléments constituant la plateforme My Immo (logo, textes, graphismes, interface) sont la propriété exclusive de My Immo. Toute reproduction ou utilisation sans autorisation est strictement interdite. Les contenus publiés par les utilisateurs (photos, textes des annonces) restent leur propriété, mais ils concèdent à My Immo une licence d'utilisation non exclusive pour les besoins du service.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 6 : Modification des CGU</h2>
          <p>
            My Immo se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle. La poursuite de l'utilisation de la plateforme après modification vaut acceptation des nouvelles conditions.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 7 : Droit applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit camerounais. Tout litige relatif à leur interprétation ou exécution sera de la compétence exclusive des tribunaux de Douala.
          </p>

           <h2 className="text-2xl font-semibold text-brand-dark pt-4">Article 8 : Contact</h2>
          <p>
            Pour toute question relative aux présentes Conditions Générales d'Utilisation, vous pouvez nous contacter via la page <a href="#" onClick={(e) => { e.preventDefault(); /* This is a placeholder as we don't have navigate here, but it's illustrative */ }} className="text-brand-red hover:underline">Contact</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
