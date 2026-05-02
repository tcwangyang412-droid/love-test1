
export default async function handler(req, res) {
  const { orderId } = req.query
  if (!orderId) return res.status(400).json({ paid: false })
  const paid = global.orderPaid && global.orderPaid[orderId]
  res.status(200).json({ paid: !!paid })
}
