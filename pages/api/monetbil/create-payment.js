//
// ATTENTION : CE FICHIER EST UN EXEMPLE DE LOGIQUE BACKEND.
// Il ne peut pas fonctionner directement dans cette application React côté client.
// Pour utiliser ce code, vous devez le déployer sur un serveur backend (par exemple, avec Node.js, Express, ou une fonction serverless).
//

/**
 * Cette fonction API est destinée à être appelée depuis votre frontend.
 * Elle crée une transaction de paiement sécurisée côté serveur et renvoie l'URL de paiement à l'utilisateur.
 *
 * @param {object} req - L'objet de la requête, contenant les informations sur l'utilisateur et le paiement.
 * @param {object} res - L'objet de la réponse, pour renvoyer l'URL de paiement ou une erreur.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Dans une vraie application, vous vérifieriez l'authentification de l'utilisateur ici.
  const { userId, amount, email, phone, name } = req.body;

  const MONETBIL_SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY; // e.g., 'e0Ic7UWrUiz56lNDI0mATUbe4ZcVXiDZ'
  const MONETBIL_SECRET_KEY = process.env.MONETBIL_SECRET_KEY; // IMPORTANT: Gardez ceci secret sur votre serveur !

  if (!MONETBIL_SERVICE_KEY || !MONETBIL_SECRET_KEY) {
    return res.status(500).json({ error: 'Les clés Monetbil ne sont pas configurées sur le serveur.' });
  }

  const paymentData = {
    amount,
    phone,
    email,
    first_name: name.split(' ')[0],
    last_name: name.split(' ').slice(1).join(' '),
    // 'notify_url' est crucial. C'est l'URL que Monetbil appellera pour confirmer le statut du paiement.
    notify_url: 'https://VOTRE_SITE_WEB.com/api/monetbil/notify',
    // 'return_url' est l'URL où l'utilisateur est redirigé après le paiement.
    return_url: 'https://VOTRE_SITE_WEB.com/dashboard',
    item_ref: `PREMIUM-${userId}-${Date.now()}`,
    // ... autres paramètres requis par Monetbil
  };

  try {
    // Étape 1 : Obtenir un token d'accès auprès de Monetbil en utilisant vos clés secrètes.
    // Cette étape est hypothétique et dépend de l'API exacte de Monetbil pour la création de paiement côté serveur.
    // Souvent, il s'agit d'un appel POST à une URL comme `https://api.monetbil.com/v1/auth/token`
    
    // Étape 2 : Utiliser le token pour créer le paiement.
    // C'est ici que vous feriez un appel à l'API de Monetbil avec `paymentData`.
    // Exemple d'appel (la structure exacte peut varier) :
    /*
    const response = await fetch(`https://api.monetbil.com/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer VOTRE_TOKEN_SECRET`,
        'X-Service-Key': MONETBIL_SERVICE_KEY,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('La création du paiement a échoué.');
    }

    const result = await response.json();
    const paymentUrl = result.payment_url;
    */
    
    // --- SIMULATION POUR L'EXEMPLE ---
    // Puisque nous ne pouvons pas faire un vrai appel API ici, nous simulons la réponse.
    const paymentUrl = `https://monetbil.com/pay/SIMULATED_URL_POUR_${userId}`;
    // --- FIN DE LA SIMULATION ---
    
    // Renvoyer l'URL de paiement au frontend
    res.status(200).json({ paymentUrl });

  } catch (error) {
    console.error('Erreur lors de la création du paiement Monetbil:', error);
    res.status(500).json({ error: 'Impossible de traiter la demande de paiement.' });
  }
}
