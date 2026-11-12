import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, CheckCircle2, Search, ShieldCheck, FileText
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { InvoiceModal } from '@/components/common/InvoiceModal';
import { useAppStore } from '@/store/appStore';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { paymentService } from '@/services/api/paymentService';
import type { Order } from '@/types/order';

export function Purchases() {
  const navigate = useNavigate();
  const { orders, user, addOrder } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    paymentService.getPurchases().then((serverOrders) => {
      if (serverOrders && Array.isArray(serverOrders)) {
        serverOrders.forEach((so) => {
          if (!orders.some((o) => o.id === so.id || o.paypalOrderId === so.paypalOrderId)) {
            let items = [];
            try {
              if (so.itemsJson) items = JSON.parse(so.itemsJson);
            } catch {}
            addOrder({
              id: so.id,
              userId: user.id,
              items,
              merchant: so.merchant || 'PayPal Merchant',
              totalAmount: so.amount,
              currency: so.currency,
              paypalOrderId: so.paypalOrderId,
              orderStatus: so.orderStatus,
              source: 'manual',
              createdAt: so.createdAt,
              completedAt: so.updatedAt,
            });
          }
        });
      }
    }).catch(() => {});
  }, []);

  const totalSpent = orders
    .filter(o => o.orderStatus === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const completedCount = orders.filter(o => o.orderStatus === 'completed').length;

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const matchesSearch = !searchQuery || 
      o.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some(i => i.productTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.paypalOrderId && o.paypalOrderId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <PageContainer
      title="My Purchases"
      subtitle="Verified order receipts, captured PayPal Sandbox transaction IDs, and agentic checkout ledger."
    >
      <div className="space-y-6 pt-1 pb-12">
        {/* Compact Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-4.5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
              Order Volume
            </span>
            <div className="text-2xl font-extrabold tabular-nums text-[#192923]">
              {orders.length} orders
            </div>
            <p className="mt-1 text-xs text-[#858A83]">
              {completedCount} captured & confirmed
            </p>
          </div>

          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-4.5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
              Total Debited
            </span>
            <div className="text-2xl font-extrabold tabular-nums text-[#192923]">
              {formatCurrency(totalSpent, user.currency)}
            </div>
            <p className="mt-1 text-xs text-[#858A83]">
              Accounted in financial insights
            </p>
          </div>

          <div className="bg-white border border-[#E9E6DE] rounded-[14px] p-4.5 shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
              Payment Gateway
            </span>
            <div className="text-base font-bold text-[#192923] mt-1 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span>PayPal Sandbox</span>
            </div>
            <p className="mt-1 text-xs text-[#858A83]">
              Idempotent Orders API v2
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-white border border-[#E9E6DE] rounded-[14px] shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858A83]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, merchant, or order ID..."
              className="w-full h-9 pl-9 pr-3 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[8px] text-xs text-[#242C27] placeholder:text-[#858A83] focus:outline-none focus:border-[#192923]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'completed', 'pending', 'failed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#192923] text-white'
                    : 'bg-[#F6F4EE] text-[#242C27]/70 hover:bg-[#E9E6DE]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No purchase orders found"
            description="Purchases made through Morrow or authorized by price watch auto-buy will appear here."
            action={{
              label: 'Browse Products',
              onClick: () => navigate('/discover'),
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#E9E6DE] hover:border-[#192923]/30 rounded-[14px] p-5 shadow-[0_6px_24px_rgba(25,41,35,0.045)] transition-all duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E6DE]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#192923]">{order.merchant}</span>
                      <span className="text-xs text-[#858A83]">· Placed {formatDate(order.createdAt)}</span>
                    </div>
                    {order.paypalOrderId && (
                      <div className="text-[11px] text-[#858A83] mt-0.5">
                        PayPal Ref: <span className="font-mono text-[#192923] font-semibold">{order.paypalOrderId}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-2.5 py-1 rounded-[8px] text-xs font-bold bg-[#F6F4EE] border border-[#E9E6DE] text-[#192923] hover:bg-[#E9E6DE] flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View & Download Invoice"
                    >
                      <FileText size={12} className="text-[#192923]" />
                      <span>Invoice</span>
                    </button>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span className="capitalize">{order.orderStatus}</span>
                    </span>
                    <span className="text-sm font-extrabold tabular-nums text-[#192923]">
                      {formatCurrency(order.totalAmount, order.currency)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 divide-y divide-[#E9E6DE]">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-10 h-10 rounded-[6px] object-cover bg-[#F6F4EE] border border-[#E9E6DE]"
                          />
                        )}
                        <span className="text-xs font-medium text-[#242C27] truncate">
                          {item.productTitle} × {item.quantity}
                        </span>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-[#192923]">
                        {formatCurrency(item.unitPrice * item.quantity, order.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <InvoiceModal
        open={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </PageContainer>
  );
}
