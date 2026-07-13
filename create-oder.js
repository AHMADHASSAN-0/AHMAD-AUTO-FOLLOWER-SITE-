import Order from '../../models/Order';
import dbConnect from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  const { channelLink, platform, followers, amount } = req.body;

  // ✅ Validate
  if (!channelLink || !followers || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Save order in DB
    const order = new Order({
      channelLink,
      platform,
      followers,
      amount,
      status: 'pending',
      paymentId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    });
    await order.save();

    // 🔥 Here integrate your payment gateway (Razorpay/PayPal/Stripe)
    // For demo, we'll use a mock payment URL
    const paymentUrl = `https://your-payment-gateway.com/pay?order=${order.paymentId}&amount=${amount}`;

    res.status(200).json({
      success: true,
      paymentUrl,
      orderId: order._id,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}
