import Order from '../../models/Order';
import dbConnect from '../../lib/db';
import { addFollowers } from '../../lib/bot';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  const { orderId, paymentStatus } = req.body;

  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (paymentStatus === 'success') {
      // ✅ Payment successful - trigger bot
      order.status = 'completed';
      await order.save();

      // 🔥 Bot will add followers
      await addFollowers(order.channelLink, order.followers);

      return res.status(200).json({
        success: true,
        message: `✅ ${order.followers} followers added!`,
      });
    } else {
      order.status = 'failed';
      await order.save();
      return res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
}
