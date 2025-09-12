"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface CompanyData {
  id: string;
  company: string;
  ticker: string;
  tier: string;
  tierColor: string;
  similarity: number;
  industry: string;
  revenueAtIPO: string;
  dateOfFiling: string;
  issuersCounsel: string;
  uwCounsel: string;
  class: string;
  selected: boolean;
}

interface PrecedentCompaniesTableProps {
  data: CompanyData[];
  onSelectionChange?: (selectedCompanies: CompanyData[]) => void;
  onConfirm?: (selectedCompanies: CompanyData[]) => void;
}

export default function PrecedentCompaniesTable({ 
  data: initialData, 
  onSelectionChange,
  onConfirm 
}: PrecedentCompaniesTableProps) {
  const [data, setData] = useState<CompanyData[]>(initialData);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const columns: ColumnDef<CompanyData>[] = useMemo(() => [
    {
      id: "select",
      size: 40,
      header: () => (
        <div className="px-1">
          <Checkbox
            checked={data.filter(row => row.selected).length === data.length && data.length > 0}
            onCheckedChange={(value) => {
              const newData = data.map(row => ({ ...row, selected: !!value }));
              setData(newData);
              onSelectionChange?.(newData.filter(row => row.selected));
            }}
            className="h-4 w-4 rounded border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <Checkbox
            checked={row.original.selected}
            onCheckedChange={(value) => {
              const newData = data.map(item => 
                item.id === row.original.id 
                  ? { ...item, selected: !!value }
                  : item
              );
              setData(newData);
              onSelectionChange?.(newData.filter(row => row.selected));
            }}
            className="h-4 w-4 rounded border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
          />
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: () => <div className="text-neutral-600 font-medium text-xs truncate">Company</div>,
      size: 200,
      cell: ({ row }) => (
        <div className="flex flex-col gap-0">
          <div className="text-neutral-900 font-normal text-sm truncate">{row.original.company}</div>
          <div className="text-neutral-500 text-xs">{row.original.ticker}</div>
        </div>
      ),
    },
    {
      accessorKey: "similarity",
      header: () => <div className="text-neutral-600 font-medium text-xs truncate">Similarity</div>,
      size: 180,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-[100px] h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${row.original.similarity}%`, backgroundColor: '#7454B6' }}
            />
          </div>
          <span className="text-sm text-neutral-600 min-w-[3ch]">{row.original.similarity}%</span>
        </div>
      ),
    },
    {
      accessorKey: "industry",
      header: () => <div className="text-neutral-600 font-medium text-xs truncate">Industry</div>,
      size: 130,
      cell: ({ row }) => (
        <div className="text-neutral-900 text-sm truncate">{row.original.industry}</div>
      ),
    },
    {
      accessorKey: "revenueAtIPO",
      header: () => <div className="text-neutral-600 font-medium text-xs text-right pr-4 truncate">Revenue at IPO</div>,
      size: 150,
      cell: ({ row }) => (
        <div className="text-neutral-900 text-right pr-4 text-sm">{row.original.revenueAtIPO}</div>
      ),
    },
    {
      accessorKey: "dateOfFiling",
      header: () => <div className="text-neutral-600 font-medium text-xs truncate">Date of S-1/A filing</div>,
      size: 140,
      cell: ({ row }) => (
        <div className="text-neutral-900 text-sm">{row.original.dateOfFiling}</div>
      ),
    },
    {
      accessorKey: "issuersCounsel",
      header: () => <div className="text-neutral-600 font-medium text-xs truncate">Issuer&apos;s counsel</div>,
      size: 180,
      cell: ({ row }) => (
        <div className="text-neutral-900 text-sm truncate">{row.original.issuersCounsel}</div>
      ),
    },
    {
      accessorKey: "uwCounsel",
      header: () => <div className="text-neutral-600 font-medium text-xs truncate">UW&apos;s Counsel</div>,
      size: 180,
      cell: ({ row }) => (
        <div className="text-neutral-900 text-sm truncate">{row.original.uwCounsel}</div>
      ),
    },
    {
      accessorKey: "class",
      header: () => <div className="text-neutral-600 font-medium text-xs truncate">Class</div>,
      size: 100,
      cell: ({ row }) => (
        <div className="text-neutral-900 text-sm">{row.original.class}</div>
      ),
    },
  ], [data, onSelectionChange]);

  // Filter data if confirmed
  const displayData = useMemo(() => 
    isConfirmed ? data.filter(row => row.selected) : data,
    [isConfirmed, data]
  );
  
  // Build columns dynamically based on confirmed state
  const displayColumns = useMemo(() => 
    isConfirmed ? columns.filter(col => col.id !== 'select') : columns,
    [isConfirmed, columns]
  );

  const table = useReactTable({
    data: displayData,
    columns: displayColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const selectedCount = data.filter(row => row.selected).length;

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-neutral-200 h-8 bg-neutral-50">
                {table.getHeaderGroups().map(headerGroup => (
                  headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={cn(
                        "text-left font-medium text-xs py-2 px-2 whitespace-nowrap overflow-hidden",
                        header.id === "select" && "w-[60px]",
                        header.column.columnDef.size && `w-[${header.column.columnDef.size}px]`
                      )}
                      style={{ width: header.column.columnDef.size }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-neutral-100 transition-all duration-150",
                    hoveredRow === row.id && "bg-neutral-50/50",
                    index === table.getRowModel().rows.length - 1 && "border-b-0"
                  )}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="py-3 px-2 whitespace-nowrap overflow-hidden"
                      style={{ width: cell.column.columnDef.size, maxWidth: cell.column.columnDef.size }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer buttons outside the table - only show if not confirmed */}
      {!isConfirmed && (
        <div className="mt-3 flex items-center justify-between">
          <Button
            variant="outline"
            className="text-sm"
          >
            Add company
          </Button>
          
          <Button
            onClick={() => {
              const selectedCompanies = data.filter(row => row.selected);
              setIsConfirmed(true);
              onConfirm?.(selectedCompanies);
            }}
            disabled={selectedCount === 0}
            className={cn(
              "text-sm",
              selectedCount === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
}
