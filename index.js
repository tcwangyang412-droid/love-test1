
import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const paid = localStorage.getItem('paidReport')
    if (paid === 'true') setUnlocked(true)
  }, [])

  useEffect(() => {
    if (unlocked || !orderId) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-order?orderId=${orderId}`)
        const data = await res.json()
        if (data.paid) {
          localStorage.setItem('paidReport', 'true')
          setUnlocked(true)
          clearInterval(interval)
        }
      } catch (err) {
        console.error('轮询支付状态失败', err)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [unlocked, orderId])

  const handlePay = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 9.9 })
      })
      const data = await res.json()
      if (data.paymentUrl && data.orderId) {
        setOrderId(data.orderId)
        window.location.href = data.paymentUrl
      } else {
        alert('生成支付链接失败')
      }
    } catch (err) {
      console.error(err)
      alert('调用支付接口异常')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCard = () => {
    if (!cardRef.current) return
    html2canvas(cardRef.current).then(canvas => {
      const link = document.createElement('a')
      link.download = '暧昧对象报告.png'
      link.href = canvas.toDataURL()
      link.click()
    })
  }

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>暧昧对象真实想法检测</h2>

      {!unlocked ? (
        <>
          <p>20题测出：他到底想认真，还是只是享受你的喜欢</p>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: '#FFD700',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16,
              marginTop: 20,
            }}
          >
            {loading ? '生成支付链接...' : '¥9.9 解锁完整报告'}
          </button>
        </>
      ) : (
        <>
          <div ref={cardRef} style={{
            marginTop: 20,
            padding: 20,
            border: '1px solid #eee',
            borderRadius: 8,
            background: `url(/share-bg.jpg) center/cover no-repeat`,
            color: '#fff'
          }}>
            <h3>完整报告已解锁 🎉</h3>
            <p>❤️ 情感标签：高依赖、情绪牵引强</p>
            <p>💡 关系建议：付出同时关注自我，避免过度投入</p>
            <p>📈 未来走势：高概率正缘，稳步上升</p>
            <p style={{ fontSize: 12, marginTop: 10 }}>🔗 点击测试链接：https://your-vercel-domain.vercel.app</p>
          </div>
          <button onClick={handleSaveCard} style={{
            marginTop: 20,
            padding: '10px 16px',
            backgroundColor: '#3D8C8C',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}>
            保存分享卡片
          </button>
        </>
      )}
    </div>
  )
}
