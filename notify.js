
export default async function handler(req, res) {
  const { out_trade_no } = req.body
  if (!out_trade_no) return res.status(400).send('fail')
  global.orderPaid = global.orderPaid || {}
  global.orderPaid[out_trade_no] = true
  res.status(200).send('success')
}
