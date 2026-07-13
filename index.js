import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { SiPaypal, SiRazorpay } from 'react-icons/si';

export default function Home() {
  const [channelLink, setChannelLink] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [followers, setFollowers] = useState(100);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const PRICES = {
    100: { price: 5, label: '100 Followers' },
    500: { price: 20, label: '500 Followers' },
    1000: { price: 35, label: '1000 Followers' },
    5000: { price: 150, label: '5000 Followers' },
  };

  const handlePayment = async () => {
    if (!channelLink) {
      setStatus('❌ Please enter your channel link');
      return;
    }

    setLoading(true);
    setStatus('⏳ Creating payment order...');

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelLink,
          platform,
          followers,
          amount: PRICES[followers].price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Redirect to payment page (Razorpay/PayPal)
        window.location.href = data.paymentUrl;
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (error) {
      setStatus('❌ Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>🚀 Grow Your Channel - Instant Followers</title>
        <meta name="description" content="Get real followers for your channel instantly" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              🚀 Channel Grow
            </h1>
            <p className="text-gray-300 mt-3 text-lg">
              Get real followers instantly • 100% Safe • Money-back Guarantee
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
            
            {/* Platform Selector */}
            <div className="flex gap-4 mb-6 justify-center">
              {['youtube', 'instagram', 'tiktok'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition ${
                    platform === p
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {p === 'youtube' && <FaYoutube />}
                  {p === 'instagram' && <FaInstagram />}
                  {p === 'tiktok' && <FaTiktok />}
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {/* Channel Link Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Your Channel Link
              </label>
              <input
                type="url"
                value={channelLink}
                onChange={(e) => setChannelLink(e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            {/* Followers Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Select Followers Package
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(PRICES).map(([count, { price, label }]) => (
                  <button
                    key={count}
                    onClick={() => setFollowers(Number(count))}
                    className={`p-4 rounded-2xl border-2 transition ${
                      followers === Number(count)
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold text-lg">{label}</div>
                    <div className="text-sm text-gray-400">${price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl hover:scale-105 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `💰 Pay $${PRICES[followers].price} & Grow`}
            </button>

            {/* Status Message */}
            {status && (
              <div className={`mt-4 p-4 rounded-xl ${
                status.includes('✅') ? 'bg-green-500/20 border border-green-500/30' :
                status.includes('❌') ? 'bg-red-500/20 border border-red-500/30' :
                'bg-yellow-500/20 border border-yellow-500/30'
              }`}>
                {status}
              </div>
            )}

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-gray-400">
              <div>✅ Real Followers</div>
              <div>⚡ Instant Delivery</div>
              <div>🔒 Secure Payment</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            © 2026 Channel Grow • Secure Payment via Razorpay/PayPal
          </div>
        </div>
      </div>
    </>
  );
}
