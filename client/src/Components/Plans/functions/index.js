const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

// Cloud function to handle plan subscription
exports.joinPlan = functions.https.onCall(async (data, context) => {
  const { userId, planId } = data;

  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  try {
    // Fetch the plan details from Firestore
    const planRef = admin.firestore().collection("plans").doc(planId);
    const planDoc = await planRef.get();

    // Check if the plan exists
    if (!planDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Plan not found");
    }

    const planData = planDoc.data();
    const now = admin.firestore.Timestamp.now();

    // Calculate the subscription end date
    const subscriptionEnd = admin.firestore.Timestamp.fromDate(
      new Date(now.toDate().getTime() + planData.duration * 24 * 60 * 60 * 1000)
    );

    // Update the user's subscription information in Firestore
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.set(
      {
        plan: planData.name,
        subscription_start: now,
        subscription_end: subscriptionEnd,
        is_active: true,
        userId: userId,
      },
      { merge: true } // Merge data to avoid overwriting the entire document
    );

    return {
      message: `Successfully joined the ${planData.name} plan! You will enjoy our best features.`,
    };
  } catch (error) {
    // Handle errors
    throw new functions.https.HttpsError(
      "internal",
      "Error joining plan",
      error.message
    );
  }
});
