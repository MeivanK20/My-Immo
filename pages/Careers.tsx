export const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Rejoignez Notre Équipe</h1>
          <p className="text-xl text-green-100">
            Construisez votre carrière avec My Immo et transformez l'immobilier camerounais
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Join Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Pourquoi Rejoindre My Immo ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🚀 Innovation Continue</h3>
              <p className="text-gray-700">
                Travaillez sur des projets technologiques de pointe qui transforment le marché immobilier africain. 
                Vous aurez l'opportunité de contribuer à des solutions qui impactent des milliers de personnes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">💰 Compensation Compétitive</h3>
              <p className="text-gray-700">
                Nous offrons des salaires compétitifs, des bonus de performance et des avantages sociaux 
                attrayants pour retenir nos meilleurs talents.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">📚 Développement Professionnel</h3>
              <p className="text-gray-700">
                Accès à des formations régulières, des conférences industrielles et des opportunités 
                de mentorat pour accélérer votre croissance professionnelle.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🌍 Culture Inclusive</h3>
              <p className="text-gray-700">
                Nous valorisons la diversité et l'inclusion. Notre équipe multiculturelle collabore 
                dans un environnement accueillant et respectueux.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">⚖️ Équilibre Vie-Travail</h3>
              <p className="text-gray-700">
                Horaires flexibles, télétravail optionnel et une politique de congés généreuse 
                pour maintenir un équilibre sain.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🎯 Impact Significatif</h3>
              <p className="text-gray-700">
                Votre travail a un impact direct sur des vies réelles. Aidez les Camerounais 
                à trouver leurs propriétés de rêve et à réaliser leurs ambitions.
              </p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Postes Disponibles</h2>
          <div className="space-y-6">
            {[
              {
                title: 'Développeur Full Stack',
                department: 'Technologie',
                level: 'Senior',
                location: 'Douala',
                description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe et développer des fonctionnalités innovantes.'
              },
              {
                title: 'Agent Immobilier',
                department: 'Ventes & Marketing',
                level: 'Intermédiaire',
                location: 'Yaoundé',
                description: 'Rejoignez notre équipe de ventes et aidez nos clients à trouver les meilleures propriétés. Excellente commission et support.'
              },
              {
                title: 'Responsable Marketing Digital',
                department: 'Marketing',
                level: 'Intermédiaire',
                location: 'Douala',
                description: 'Pilotez notre stratégie marketing digital, gérez les campagnes et développez notre présence en ligne.'
              },
              {
                title: 'Spécialiste Relation Client',
                department: 'Support Client',
                level: 'Junior',
                location: 'Douala',
                description: 'Offrez un excellent service client, répondez aux questions et résolvez les problèmes de nos utilisateurs.'
              }
            ].map((job, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{job.department}</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{job.level}</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{job.location}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                  Postuler
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Internships Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 p-12 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Programme de Stage</h2>
          <p className="text-gray-700 text-lg mb-6">
            My Immo offre des opportunités de stage pour les étudiants et jeunes diplômés souhaitant 
            acquérir une expérience pratique dans le secteur immobilier et technologique.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Durée & Compensation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Durée : 3 à 6 mois</li>
                <li>• Indemnité mensuelle : 50,000 - 100,000 FCFA</li>
                <li>• Horaire : 40 heures/semaine</li>
                <li>• Flexible : Télétravail disponible</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Avantages</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Mentorat personnalisé</li>
                <li>• Certification à la fin du stage</li>
                <li>• Possibilité de CDI pour les meilleurs stagiaires</li>
                <li>• Environnement d'apprentissage dynamique</li>
              </ul>
            </div>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition text-lg">
            Candidater au Programme de Stage
          </button>
        </section>
      </div>
    </div>
  );
};
