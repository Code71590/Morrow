import React, { useRef } from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import type { Order } from '@/types/order';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { useAppStore } from '@/store/appStore';
import { Button } from './Button';

export interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export function InvoiceModal({ open, onClose, order }: InvoiceModalProps) {
  const { user } = useAppStore();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!open || !order) return null;

  const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${(order.paypalOrderId || order.id).slice(-8).toUpperCase()}`;
  const items = order.items && order.items.length > 0 ? order.items : [
    {
      id: 'default_item',
      productId: 'p_1',
      productTitle: order.merchant ? `${order.merchant} Purchase` : 'Product Order',
      productImage: '',
      quantity: 1,
      unitPrice: order.totalAmount / 1.08,
      currency: order.currency,
    },
  ];

  const subtotal = Math.round((order.totalAmount / 1.08) * 100) / 100;
  const tax = Math.round((order.totalAmount - subtotal) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-[16px] shadow-2xl border border-[#E9E6DE] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Action Bar (hidden in print) */}
        <div className="p-3.5 bg-[#192923] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold font-heading">Verified Purchase Invoice</span>
            <span className="text-[10px] font-mono opacity-60">· {invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer size={13} />}
              className="text-xs h-8 text-black border-white/20 hover:bg-white hover:text-black cursor-pointer"
            >
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-[8px] text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div ref={invoiceRef} className="p-8 overflow-y-auto space-y-6 text-[#192923] print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E9E6DE]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-[8px] bg-[#192923] text-white flex items-center justify-center font-bold text-sm">
                  M
                </div>
                <h2 className="text-xl font-bold font-heading text-[#192923]">Morrow Financial</h2>
              </div>
              <p className="text-xs text-[#858A83]">
                Smart Shopping & Financial Companion<br />
                San Francisco, CA · support@trymorrow.ai
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block">
                Official Receipt / Invoice
              </span>
              <span className="text-base font-extrabold font-mono text-[#192923] block">
                {invoiceNumber}
              </span>
              <span className="text-xs text-[#858A83] mt-1 block">
                Issued: {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Bill To & Payment Gateway Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#F6F4EE] rounded-[10px] border border-[#E9E6DE] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
                Billed To
              </span>
              <p className="font-bold text-sm text-[#192923]">{user.displayName || 'Alex Johnson'}</p>
              <p className="text-[#858A83]">Personal Consumer Account</p>
              <p className="text-[#858A83]">Account ID: {user.id || 'demo_user'}</p>
            </div>

            <div className="p-3.5 bg-[#F6F4EE] rounded-[10px] border border-[#E9E6DE] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858A83] block mb-1">
                Payment Verification
              </span>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 size={13} className="text-emerald-700" />
                <span>PAID & CAPTURED</span>
              </div>
              <p className="text-[#858A83]">Method: PayPal Sandbox</p>
              {order.paypalOrderId && (
                <p className="font-mono text-[11px] text-[#192923] truncate">
                  Ref: {order.paypalOrderId}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[#E9E6DE] rounded-[10px] overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF9F5] border-b border-[#E9E6DE] text-[#858A83] uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6DE]">
                {items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-3 px-4 font-medium text-[#192923]">
                      <div className="flex items-center gap-2.5">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt=""
                            className="w-8 h-8 rounded-[4px] object-cover border border-[#E9E6DE]"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{item.productTitle}</p>
                          <span className="text-[10px] text-[#858A83]">Merchant: {order.merchant}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums text-[#858A83]">
                      {item.quantity || 1}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-[#858A83]">
                      {formatCurrency(item.unitPrice, order.currency)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-[#192923]">
                      {formatCurrency(item.unitPrice * (item.quantity || 1), order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[#858A83]">
                <span>Item Subtotal:</span>
                <span className="tabular-nums font-medium text-[#192923]">
                  {formatCurrency(subtotal, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#858A83]">
                <span>Estimated Tax (8%):</span>
                <span className="tabular-nums font-medium text-[#192923]">
                  {formatCurrency(tax, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#858A83]">
                <span>Shipping:</span>
                <span className="font-bold text-emerald-800">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E9E6DE] text-sm font-extrabold text-[#192923]">
                <span>Total Debited:</span>
                <span className="tabular-nums text-base">
                  {formatCurrency(order.totalAmount, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-[#E9E6DE] text-[11px] text-[#858A83] text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-semibold">
              <ShieldCheck size={14} />
              <span>Deducted & Accounted in Morrow Cash Flow Ledger</span>
            </div>
            <p>
              Thank you for trusting Morrow with your smart shopping and financial wellness decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
