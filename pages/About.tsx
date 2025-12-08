export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">À Propos de My Immo</h1>
          <p className="text-xl text-blue-100">
            Transforming real estate in Cameroon with innovation and trust
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed">
                My Immo est une plateforme immobilière novatrice dédiée à la transformation du secteur de l'immobilier au Cameroun. 
                Nous nous engageons à simplifier et démocratiser l'accès au marché immobilier en fournissant des outils fiables, 
                transparents et accessibles à tous.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Nos Valeurs</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Transparence</strong> — Toutes les informations sont claires et vérifiées</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Fiabilité</strong> — Nous garantissons la qualité de nos services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Innovation</strong> — Nous adoptons les dernières technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Accessibilité</strong> — Notre plateforme est disponible pour tous</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* History & Growth */}
        <section className="mb-16 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Fondée en 2023, My Immo est née de la conviction que le marché immobilier camerounais méritait 
            une plateforme moderne et efficace. Notre équipe passionnée a travaillé sans relâche pour 
            créer une expérience utilisateur exceptionnelle qui répond aux besoins spécifiques du marché africain.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Aujourd'hui, nous servons des milliers d'utilisateurs à travers le Cameroun, facilitant 
            des transactions immobilières, du conseil d'experts et des services de gestion de propriété.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">10K+</div>
            <p className="text-blue-100">Propriétés Listées</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">50K+</div>
            <p className="text-green-100">Utilisateurs Actifs</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <p className="text-purple-100">Agents Immobiliers</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">100%</div>
            <p className="text-orange-100">Satisfaction</p>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Notre Équipe</h2>
          <p className="text-gray-700 text-lg mb-8">
            My Immo est animée par une équipe diversifiée et talentueuse d'experts en immobilier, 
            de développeurs et de professionnels du service client dédiés à votre succès.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Jean Moise', role: 'Fondateur & CEO', area: 'Stratégie Immobilière' },
              { name: 'Marie Dubé', role: 'CTO', area: 'Technologie & Innovation' },
              { name: 'Pierre Nkomo', role: 'Directeur Commercial', area: 'Développement Marché' }
            ].map((member) => (
              <div key={member.name} className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.area}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
