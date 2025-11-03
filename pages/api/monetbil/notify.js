//
// ATTENTION : CE FICHIER EST UN EXEMPLE DE LOGIQUE BACKEND (Webhook/IPN).
// Il ne peut pas fonctionner directement dans cette application React côté client.
// Il doit être déployé sur un serveur public accessible par les serveurs de Monetbil.
//

// Importer le client Supabase pour mettre à jour la base de données
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);


/**
 * Cette fonction est un webhook (ou IPN - Instant Payment Notification).
 * Monetbil enverra une requête POST à cette URL lorsque l'état d'un paiement change.
 * C'est la source de vérité pour savoir si un paiement a réussi ou échoué.
 *
 * @param {object} req - La requête POST envoyée par Monetbil.
 * @param {object} res - La réponse à renvoyer à Monetbil.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const afGHt8e45nV5M93pvNPFpoLu9lfomthJHcHFap12oLjYIrD5QQk5iqaFU6MEGdFG = process.env.afGHt8e45nV5M93pvNPFpoLu9lfomthJHcHFap12oLjYIrD5QQk5iqaFU6MEGdFG;

  try {
    const paymentData = req.body;
    console.log('Notification de paiement reçue de Monetbil:', paymentData);

    // Étape 1 : Vérifier l'authenticité de la notification (TRÈS IMPORTANT)
    // Monetbil inclut généralement une signature dans les en-têtes ou le corps de la requête.
    // Vous devez la recalculer avec votre clé secrète et les données reçues pour
    // vous assurer que la requête provient bien de Monetbil.
    // const signature = req.headers['monetbil-signature'];
    // const isAuthentic = verifyMonetbilSignature(paymentData, signature, MONETBIL_SECRET_KEY);
    // if (!isAuthentic) {
    //   return res.status(401).send('Signature invalide.');
    // }

    const { status, transaction_id, item_ref } = paymentData;

    // Extrait l'ID de l'utilisateur de notre référence d'article personnalisée
    const userId = item_ref.split('-')[1];

    if (status === 'success') {
      // Étape 2 : Le paiement a réussi. Mettez à jour votre base de données.

      // 2a. Enregistrer la transaction dans la table 'payments'
      /*
      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'succeeded',
        provider: 'monetbil',
        provider_transaction_id: transaction_id,
      });

      if (paymentError) throw paymentError;
      */
      
      // 2b. Mettre à jour le profil de l'utilisateur pour lui donner l'accès premium
      /*
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'premium', role: 'agent' })
        .eq('id', userId);
        
      if (profileError) throw profileError;
      */

      console.log(`Le paiement ${transaction_id} pour l'utilisateur ${userId} a réussi. Accès Premium accordé.`);

    } else {
      // Le paiement a échoué ou a été annulé
      // Vous pourriez vouloir enregistrer cette information également.
      console.log(`Le paiement ${transaction_id} pour l'utilisateur ${userId} a échoué avec le statut : ${status}`);
    }

    // Étape 3 : Renvoyer une réponse 200 OK à Monetbil pour leur dire que vous avez bien reçu la notification.
    // Si vous ne le faites pas, Monetbil pourrait essayer de renvoyer la notification plusieurs fois.
    res.status(200).send('Notification reçue.');

  } catch (error) {
    console.error('Erreur lors du traitement de la notification Monetbil:', error);
    // Renvoyer une erreur 500 pour que Monetbil puisse réessayer plus tard.
    res.status(500).send('Erreur interne du serveur.');
  }
}
