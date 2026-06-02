import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import TradesManager, { type TradeRow } from './TradesManager'

export const dynamic = 'force-dynamic'

export default async function AdminTradesPage() {
  // Admin-only — wahi pattern jo baqi admin pages mein hai
  const admin = await getAdminUser()
  if (!admin) {
    redirect('/auth/login')
  }

  const trades = await prisma.trade.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  const rows: TradeRow[] = trades.map((t) => ({
    id: t.id,
    imageUrl: t.imageUrl,
    alt: t.alt ?? null,
    order: t.order,
  }))

  return <TradesManager initialTrades={rows} />
}
