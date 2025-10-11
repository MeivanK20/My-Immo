import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-dark">Politique de Confidentialité</h1>
          <p className="text-lg text-gray-600 mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
        </div>

        <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            My Immo ("nous", "notre") s'engage à protéger la vie privée de ses utilisateurs. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">1. Collecte de l'information</h2>
          <p>
            Nous collectons des informations de plusieurs manières lorsque vous utilisez nos services :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Informations fournies par l'utilisateur :</strong> Lors de la création de votre compte, nous collectons votre nom, votre adresse e-mail et votre rôle (Visiteur ou Agent). Si vous publiez une annonce, nous collectons toutes les informations relatives au bien immobilier (description, prix, localisation, photos, vidéos).</li>
            <li><strong>Informations de contact :</strong> Lorsque vous nous contactez via notre formulaire, nous collectons votre nom, email et le contenu de votre message.</li>
            <li><strong>Données d'utilisation :</strong> Nous pouvons collecter des informations sur la manière dont vous accédez et utilisez la plateforme, telles que votre adresse IP, votre type de navigateur, les pages visitées et l'heure de vos visites.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">2. Utilisation des informations</h2>
          <p>
            Les informations que nous collectons sont utilisées pour les finalités suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fournir, gérer et améliorer nos services.</li>
            <li>Personnaliser votre expérience sur la plateforme.</li>
            <li>Gérer votre compte et vous envoyer des informations administratives.</li>
            <li>Permettre la mise en relation entre les annonceurs et les visiteurs.</li>
            <li>Répondre à vos demandes et questions.</li>
            <li>Assurer la sécurité de notre plateforme et prévenir la fraude.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">3. Partage des informations</h2>
          <p>
            Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles identifiables à des tiers sans votre consentement, sauf dans les cas suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Informations publiques :</strong> Les informations de vos annonces (à l'exception de vos coordonnées directes, sauf si vous les incluez dans la description) sont publiques et visibles par tous les utilisateurs du site. Le nom de l'agent associé à une annonce est également visible.</li>
            <li><strong>Obligations légales :</strong> Nous pouvons divulguer vos informations si la loi l'exige ou pour protéger nos droits, notre propriété ou notre sécurité.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">4. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100 %. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos informations, nous ne pouvons garantir leur sécurité absolue.
          </p>
          
          <h2 className="text-2xl font-semibold text-brand-dark pt-4">5. Vos droits</h2>
          <p>
            Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez exercer ces droits :
          </p>
           <ul className="list-disc pl-6 space-y-2">
            <li>Pour les agents, en modifiant les informations de vos annonces directement depuis votre tableau de bord.</li>
            <li>En nous contactant via notre page de contact pour toute demande relative à votre compte.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">6. Cookies</h2>
          <p>
            Notre site peut utiliser des cookies pour améliorer l'expérience utilisateur, notamment pour maintenir votre session connectée. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait affecter l'utilisation de certaines parties de notre site.
          </p>

          <h2 className="text-2xl font-semibold text-brand-dark pt-4">7. Consentement</h2>
          <p>
            En utilisant notre site, vous consentez à notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
