const Subscription = require("../models/subscription");

exports.getSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    let subcription = await Subscription.findOne({ userId });
    if (!subcription) {
      subcription = new Subscription({ userId });
    }

    return res.status(200).json({
      success: true,
      data: {
        isPremium: subcription.isPremium,
        premiumSince: subcription.premiumSince,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while getting subscription data",
    });
  }
};
