"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

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
  s1Url?: string;
  logo?: string;
}

interface PrecedentCompaniesTableProps {
  data: CompanyData[];
  onSelectionChange?: (selectedCompanies: CompanyData[]) => void;
  onConfirm?: (selectedCompanies: CompanyData[]) => void;
  isConfirmed?: boolean;
}

export default function PrecedentCompaniesTable({ 
  data: initialData, 
  onSelectionChange,
  onConfirm,
  isConfirmed: isConfirmedProp = false
}: PrecedentCompaniesTableProps) {
  const [data, setData] = useState<CompanyData[]>(initialData);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(isConfirmedProp);

  // Update isConfirmed when prop changes
  useEffect(() => {
    setIsConfirmed(isConfirmedProp);
  }, [isConfirmedProp]);

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
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <a 
                href={row.original.s1Url || "https://www.sec.gov/Archives/edgar/data/1535527/000104746919003095/a2238800zs-1.htm"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 font-normal text-sm truncate transition-colors hover:text-neutral-700"
                style={{ textDecoration: 'none' }}
              >
                {row.original.company}
              </a>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-white border border-neutral-200 p-4 rounded-lg shadow-lg max-w-sm"
              sideOffset={5}
            >
              <div className="flex flex-col gap-3">
                {/* Header with avatar and company info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src={row.original.logo || "/latham-logo.jpg"} 
                      alt={row.original.company} 
                      width={40} 
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-neutral-900">{row.original.company}</h3>
                    <p className="text-xs text-neutral-500">{row.original.ticker}</p>
                  </div>
                </div>
                
                {/* S-1 Excerpt */}
                <div className="text-xs text-neutral-700 leading-relaxed">
                  <p className="line-clamp-6">
                    We are a leader in cloud-delivered protection that stops breaches, 
                    protects data, and powers business velocity with a cloud-native platform 
                    that delivers comprehensive protection against sophisticated attacks. 
                    Our Falcon platform leverages artificial intelligence and behavioral analysis 
                    to provide real-time threat detection and response capabilities across 
                    endpoints, cloud workloads, identity, and data. We have experienced rapid 
                    growth, with our Annual Recurring Revenue (ARR) growing from $249.8 million 
                    as of January 31, 2019 to $874.4 million as of January 31, 2021, representing 
                    a compound annual growth rate of 87%. Our subscription-based model provides 
                    predictable revenue streams and strong unit economics.
                  </p>
                  <button 
                    className="mt-1 text-xs text-neutral-900 hover:text-neutral-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(row.original.s1Url || "https://www.sec.gov/Archives/edgar/data/1535527/000104746919003095/a2238800zs-1.htm", '_blank');
                    }}
                  >
                    View source
                  </button>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
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
