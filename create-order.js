
import crypto from 'crypto'
const MCHID = '1569579751'
const APPID = 'wx1f0c4e16d17f45a9'
const API_KEY = 'a8d9f3k2j4h6g7p9x1c2v3b4n5m6q7w8'
const NOTIFY_URL = 'https://YOUR_DOMAIN.vercel.app/api/notify'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const price = req.body.price || 9.9
  const orderId = 'ORDER_' + Date.now()
  const nonce_str = crypto.randomBytes(16).toString('hex')
  const paymentUrl = `https://pay.weixin.qq.com/example?order=${orderId}`
  global.orderPaid = global.orderPaid || {}
  global.orderPaid[orderId] = false
  res.status(200).json({ paymentUrl, orderId })
}
