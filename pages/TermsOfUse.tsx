export const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Conditions d'Utilisation</h1>
          <p className="text-xl text-indigo-100">
            Veuillez lire attentivement ces conditions avant d'utiliser notre plateforme
          </p>
          <p className="text-indigo-200 text-sm mt-4">Dernière mise à jour : Décembre 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Bienvenue sur My Immo ("la plateforme"). Ces conditions d'utilisation régissent votre accès et 
              votre utilisation de notre site web, application mobile et services connexes. En accédant à la plateforme, 
              vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Inscription aux Compte</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pour utiliser certaines fonctionnalités de la plateforme, vous devez créer un compte utilisateur. 
              Vous acceptez de fournir des informations exactes, complètes et à jour lors de l'inscription.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
              <li>Vous acceptez de ne pas partager votre compte avec d'autres personnes</li>
              <li>Vous êtes seul responsable de toute activité sur votre compte</li>
              <li>Vous devez nous notifier immédiatement de tout accès non autorisé</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation Acceptable</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vous acceptez d'utiliser la plateforme uniquement à des fins légales et d'une manière qui ne viole pas 
              les droits d'autrui ou qui ne restreint ou n'empêche l'utilisation et la jouissance de la plateforme par d'autres.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">Le comportement interdit comprend :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Harceler ou causer de la détresse ou de l'inconfort à toute personne</li>
              <li>Offenser la sensibilité religieuse ou morale d'une personne</li>
              <li>Interrompre le flux normal des dialogues dans la plateforme</li>
              <li>Publier du contenu illégal ou contraire à la loi camerounaise</li>
              <li>Frauder ou escroquer d'autres utilisateurs</li>
              <li>Utiliser des bots ou des scripts automatisés</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété Intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed">
              Le contenu de la plateforme, y compris les textes, graphiques, logos, images et logiciels, 
              est la propriété de My Immo ou de ses fournisseurs de contenu et est protégé par les lois 
              camerounaises et internationales sur les droits d'auteur. Vous n'êtes pas autorisé à 
              reproduire, republier ou distribuer le contenu sans notre permission écrite.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contenu Utilisateur</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              En soumettant du contenu à la plateforme, vous déclarez et garantissez que :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Vous êtes propriétaire ou avez le droit d'utiliser le contenu</li>
              <li>Le contenu ne viole pas les droits d'autrui</li>
              <li>Le contenu n'est pas diffamatoire, obscène ou illégal</li>
              <li>Vous accordez à My Immo une licence pour publier votre contenu</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation de Responsabilité</h2>
            <p className="text-gray-700 leading-relaxed">
              La plateforme est fournie "telle quelle" et "telle que disponible". My Immo n'offre aucune garantie 
              de quelque nature que ce soit, expresse ou implicite. En aucun cas, My Immo ne sera responsable de 
              tout dommage indirect, accidentel, spécial ou consécutif découlant de votre utilisation de la plateforme.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Résiliation</h2>
            <p className="text-gray-700 leading-relaxed">
              My Immo se réserve le droit de suspendre ou de résilier votre compte sans avertissement préalable 
              si vous violez ces conditions ou toute loi applicable. Vous pouvez fermer votre compte à tout moment 
              en contactant notre service client.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications des Conditions</h2>
            <p className="text-gray-700 leading-relaxed">
              My Immo se réserve le droit de modifier ces conditions à tout moment. Les modifications seront 
              publiées sur la plateforme avec une date de mise à jour. Votre utilisation continue de la plateforme 
              signifie que vous acceptez les modifications.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Loi Applicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Ces conditions sont régies par et interprétées conformément aux lois de la République du Cameroun. 
              Tout litige découlant de ces conditions sera soumis à la juridiction exclusive des tribunaux camerounais.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-indigo-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions ?</h2>
            <p className="text-gray-700 mb-4">
              Si vous avez des questions concernant ces conditions d'utilisation, veuillez nous contacter :
            </p>
            <div className="text-gray-700">
              <p><strong>Email :</strong> legal@myimmo.cm</p>
              <p><strong>Téléphone :</strong> +237 699 00 00 00</p>
              <p><strong>Adresse :</strong> Akwa, Douala, Cameroun</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
