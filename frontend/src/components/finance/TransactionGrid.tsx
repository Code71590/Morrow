import { useState, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, SelectionChangedEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Download, Search, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import type { Transaction } from '@/types/transaction';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency } from '@/utils/currency';
import { useAppStore } from '@/store/appStore';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface TransactionGridProps {
  onCategorySelect?: (category: string | null) => void;
  onSelectTransactions?: (transactions: Transaction[]) => void;
}

export function TransactionGrid({ onCategorySelect, onSelectTransactions }: TransactionGridProps) {
  const { transactions, user } = useAppStore();
  const gridRef = useRef<AgGridReact<Transaction>>(null);

  const [selectedTotal, setSelectedTotal] = useState<number>(0);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [quickFilterText, setQuickFilterText] = useState<string>('');

  // Custom Category Cell Renderer
  const categoryCellRenderer = useCallback((params: ICellRendererParams<Transaction>) => {
    if (!params.value) return null;
    const cat = params.value as string;
    let variant: 'persimmon' | 'success' | 'warning' | 'info' | 'default' = 'default';
    if (cat === 'Shopping') variant = 'persimmon';
    else if (cat === 'Income') variant = 'success';
    else if (cat === 'Food & Dining') variant = 'warning';
    else if (cat === 'Subscriptions') variant = 'info';

    return (
      <div className="flex items-center h-full">
        <Badge variant={variant} size="sm">
          {cat}
        </Badge>
      </div>
    );
  }, []);

  // Custom Amount Cell Renderer - right-aligned tabular numbers in INR
  const amountCellRenderer = useCallback((params: ICellRendererParams<Transaction>) => {
    if (!params.data) return null;
    const isIncome = params.data.transactionType === 'income';
    return (
      <div className={`flex items-center justify-end w-full h-full font-bold tabular-nums text-sm font-heading ${
        isIncome ? 'text-emerald-700' : 'text-[#192923]'
      }`}>
        <span className="mr-1">{isIncome ? '+' : '−'}</span>
        {formatCurrency(params.data.amount, params.data.currency || user.currency)}
      </div>
    );
  }, [user.currency]);

  // Custom Description Cell Renderer with direction icon
  const descriptionCellRenderer = useCallback((params: ICellRendererParams<Transaction>) => {
    if (!params.data) return null;
    const isIncome = params.data.transactionType === 'income';
    return (
      <div className="flex items-center gap-2.5 h-full min-w-0">
        <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0 ${
          isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F6F4EE] text-[#192923]'
        }`}>
          {isIncome ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
        </div>
        <span className="font-medium text-[#242C27] truncate text-xs">
          {params.data.description}
        </span>
      </div>
    );
  }, []);

  // Custom Status Cell Renderer with restrained dot indicator
  const statusCellRenderer = useCallback((params: ICellRendererParams<Transaction>) => {
    if (!params.value) return null;
    const status = params.value as string;
    return (
      <div className="flex items-center gap-1.5 h-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
        <span className="text-xs text-[#858A83] capitalize">{status}</span>
      </div>
    );
  }, []);

  // Column Definitions
  const columnDefs = useMemo<ColDef<Transaction>[]>(() => [
    {
      field: 'transactionDate',
      headerName: 'Date',
      width: 125,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sort: 'desc',
      cellClass: 'tabular-nums text-xs text-[#858A83]',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
      cellRenderer: descriptionCellRenderer,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 135,
      cellRenderer: categoryCellRenderer,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'merchant',
      headerName: 'Merchant',
      width: 135,
      filter: 'agTextColumnFilter',
      cellClass: 'text-xs text-[#192923] font-medium',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 135,
      cellRenderer: amountCellRenderer,
      type: 'numericColumn',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      width: 130,
      cellClass: 'text-xs text-[#858A83]',
    },
    {
      field: 'paymentStatus',
      headerName: 'Status',
      width: 110,
      cellRenderer: statusCellRenderer,
    },
  ], [amountCellRenderer, categoryCellRenderer, descriptionCellRenderer, statusCellRenderer]);

  // Handle Multi-Row Selection for live financial audit
  const onSelectionChanged = useCallback((event: SelectionChangedEvent<Transaction>) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedCount(selectedRows.length);
    const sum = selectedRows.reduce((acc, row) => row.amount + acc, 0);
    setSelectedTotal(sum);

    if (onSelectTransactions) {
      onSelectTransactions(selectedRows);
    }
  }, [onSelectTransactions]);

  // Export selected rows or full ledger to CSV
  const handleExportCsv = () => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `morrow-ledger-${new Date().toISOString().slice(0, 10)}.csv`,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Search and Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-[#E9E6DE] rounded-[12px] shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858A83]" />
          <input
            type="text"
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            placeholder="Filter transactions by merchant, description..."
            className="w-full h-9 pl-9 pr-8 bg-[#F6F4EE] border border-[#E9E6DE] rounded-[8px] text-xs text-[#242C27] placeholder:text-[#858A83] focus:outline-none focus:border-[#192923]"
          />
          {quickFilterText && (
            <button
              onClick={() => setQuickFilterText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858A83] hover:text-[#192923]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 text-xs bg-[#F6F4EE] px-3 py-1.5 rounded-[8px] border border-[#E9E6DE]">
              <span className="text-[#858A83]">{selectedCount} selected:</span>
              <span className="font-bold tabular-nums text-[#192923]">
                {formatCurrency(selectedTotal, user.currency)}
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={<Download size={13} />}
            className="text-xs h-9 font-semibold"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* AG Grid Table Container */}
      <div className="ag-theme-quartz w-full h-[400px] rounded-[14px] overflow-hidden border border-[#E9E6DE] shadow-[0_6px_24px_rgba(25,41,35,0.045)]">
        <AgGridReact<Transaction>
          ref={gridRef}
          rowData={transactions}
          columnDefs={columnDefs}
          rowSelection={{
            mode: 'multiRow',
            headerCheckbox: true,
          }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          quickFilterText={quickFilterText}
          onSelectionChanged={onSelectionChanged}
          animateRows={true}
          rowHeight={46}
          headerHeight={38}
          suppressCellFocus={true}
        />
      </div>
    </div>
  );
}
