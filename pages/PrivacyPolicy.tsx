export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-xl text-red-100">
            Comment nous collectons, utilisons et protégeons vos données personnelles
          </p>
          <p className="text-red-200 text-sm mt-4">Dernière mise à jour : Décembre 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              My Immo s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous 
              collectons, utilisons, divulguons et sauvegardons vos données lorsque vous utilisez notre plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informations que Nous Collectons</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations Fournies par Vous</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Données d'inscription (nom, email, téléphone, adresse)</li>
                  <li>Informations de profil (photo, biographie professionnelle)</li>
                  <li>Détails de paiement (numéro de carte, compte bancaire)</li>
                  <li>Communications avec notre support client</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations Collectées Automatiquement</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Adresse IP et type de navigateur</li>
                  <li>Pages visitées et durée de visite</li>
                  <li>Données de localisation (avec votre consentement)</li>
                  <li>Cookies et technologies de suivi similaires</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Comment Nous Utilisons Vos Informations</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter vos transactions et paiements</li>
              <li>Fournir et améliorer nos services</li>
              <li>Envoyer des mises à jour et notifications</li>
              <li>Répondre à vos demandes et questions</li>
              <li>Analyser l'utilisation de la plateforme</li>
              <li>Prévenir la fraude et renforcer la sécurité</li>
              <li>Respecter les obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage de Vos Données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous pouvons partager vos informations avec des prestataires de services, partenaires commerciaux 
              et autorités légales si requis. Nous ne vendons jamais vos données sans votre consentement explicite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité de Vos Données</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous implémentons des mesures de sécurité techniques et organisationnelles incluant le chiffrement SSL/TLS, 
              l'authentification multi-facteurs et des audits de sécurité réguliers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos Droits</h2>
            <p className="text-gray-700 leading-relaxed">
              Vous avez le droit d'accéder, corriger, supprimer et exporter vos données personnelles à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Utilisation des Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              My Immo utilise des cookies pour améliorer votre expérience utilisateur. Vous pouvez configurer 
              votre navigateur pour refuser les cookies.
            </p>
          </section>

          <section className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nous Contacter</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Email :</strong> privacy@myimmo.cm</p>
              <p><strong>Téléphone :</strong> +237 699 00 00 00</p>
              <p><strong>Adresse :</strong> Akwa, Douala, Cameroun</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
