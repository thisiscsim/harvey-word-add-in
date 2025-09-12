'use client';

import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  ColumnResizeMode,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

// SVG Icon Components
const TriangleAlertIcon = ({ className }: { className?: string }) => (
  <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.28902 3.51814C8.08133 2.11272 10.1123 2.11272 10.9046 3.51814L16.0474 12.3182C16.8036 13.6659 15.8251 15.3182 14.2406 15.3182H3.95306C2.36854 15.3182 1.39006 13.6659 2.14624 12.3182L7.28902 3.51814Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.09668 6.81818V9.68182" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9.09668" cy="11.9545" r="0.5" fill="black"/>
  </svg>
);

type Document = {
  id: number;
  selected: boolean;
  fileName: string;
  agreementParties?: string;
  forceMajeureClause?: string;
  assignmentProvisionSummary?: string;
  company1?: string;
  company2?: string;
  company3?: string;
  company4?: string;
  company5?: string;
  snowflake?: string;
  zscaler?: string;
  [key: string]: string | number | boolean | undefined; // Dynamic properties for company data
};

const data: Document[] = [
  {
    id: 1,
    selected: false,
    fileName: 'Cybersecurity and Data Breaches',
    company1: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    company2: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    company3: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    company4: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    company5: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 2,
    selected: false,
    fileName: 'Technology Integration & Compatibility',
    agreementParties: 'T-Mobile USA, Inc., DISH Purchasing Corporat...',
    forceMajeureClause: 'Somewhat Disputed',
    assignmentProvisionSummary: 'No assignment without prior written consent.',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 3,
    selected: false,
    fileName: 'Economic Downturn Impact',
    agreementParties: 'SunSpark Technology Inc. (California corporati...',
    forceMajeureClause: 'Not Disputed',
    assignmentProvisionSummary:
      'No assignment without consent, null if viola...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 4,
    selected: false,
    fileName: 'Intellectual Property Risk',
    agreementParties: 'Delta Airlines LLC (Georgia corporation)',
    forceMajeureClause: 'Not Disputed',
    assignmentProvisionSummary: 'No assignment without prior written consent.',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 5,
    selected: false,
    fileName: 'Key Personnel Dependence',
    agreementParties: 'Smith & Wesson Inc., Crimson Trace Corporati...',
    forceMajeureClause: 'Not Disputed',
    assignmentProvisionSummary:
      'WKKC cannot assign the contract without Kel...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 6,
    selected: false,
    fileName: 'Incurred losses, No profitability',
    agreementParties: 'No information',
    forceMajeureClause: 'Disputed',
    assignmentProvisionSummary:
      'No assignment without consent, except to wh...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 7,
    selected: false,
    fileName: 'Need for Additional Capital',
    agreementParties: 'Ultragenyx Pharmaceutical Inc. (UGX), IOI Oleo...',
    forceMajeureClause: 'Disputed',
    assignmentProvisionSummary: 'Assignment allowed with conditions.',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 8,
    selected: false,
    fileName: 'Market Acceptance',
    agreementParties: 'No information',
    forceMajeureClause: 'Disputed',
    assignmentProvisionSummary: 'Assignment requires prior written consent.',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 9,
    selected: false,
    fileName: 'Insurance',
    agreementParties: "Pilgrim's Pride Corporation (Shipper), Pat Pilgri...",
    forceMajeureClause: 'Somewhat Disputed',
    assignmentProvisionSummary: 'No assignment without prior written consent.',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 10,
    selected: false,
    fileName: 'Substantial Shares Sell-Off',
    agreementParties: 'No information',
    forceMajeureClause: 'Somewhat Disputed',
    assignmentProvisionSummary:
      'Assignment requires consent, with exception...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 11,
    selected: false,
    fileName: 'Regulatory Compliance Risk',
    agreementParties: 'Seattle Genetics, Inc. and SAFC, an operating...',
    forceMajeureClause: 'Disputed',
    assignmentProvisionSummary:
      'Assignment requires consent, with exception...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 12,
    selected: false,
    fileName: 'Competition and Market Share',
    agreementParties: 'Crown Electrokinetics Corp., Brandywine O...',
    forceMajeureClause: 'Not Disputed',
    assignmentProvisionSummary:
      "Company needs Aron's consent to assign; Aro...",
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 13,
    selected: false,
    fileName: 'Supply Chain Disruptions',
    agreementParties: 'Global Manufacturing Partners LLC...',
    forceMajeureClause: 'Disputed',
    assignmentProvisionSummary:
      'Assignment prohibited without written consent...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 14,
    selected: false,
    fileName: 'Foreign Exchange Risk',
    agreementParties: 'International Trading Corp., Deutsche Bank...',
    forceMajeureClause: 'Somewhat Disputed',
    assignmentProvisionSummary:
      'Assignment allowed with 30-day notice...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 15,
    selected: false,
    fileName: 'Customer Concentration Risk',
    agreementParties: 'Major Enterprise Solutions Inc...',
    forceMajeureClause: 'Not Disputed',
    assignmentProvisionSummary:
      'No assignment to competitors allowed...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 16,
    selected: false,
    fileName: 'Product Liability Claims',
    agreementParties: 'Consumer Safety Alliance, Hartford Insurance...',
    forceMajeureClause: 'Disputed',
    assignmentProvisionSummary:
      'Assignment requires insurance coverage proof...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 17,
    selected: false,
    fileName: 'Climate Change Impact',
    agreementParties: 'Environmental Protection Agency, State of CA...',
    forceMajeureClause: 'Not Disputed',
    assignmentProvisionSummary:
      'Assignment subject to environmental review...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 18,
    selected: false,
    fileName: 'Third-Party Dependencies',
    agreementParties: 'Amazon Web Services, Microsoft Azure...',
    forceMajeureClause: 'Somewhat Disputed',
    assignmentProvisionSummary:
      'Assignment requires vendor approval...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 19,
    selected: false,
    fileName: 'Acquisition Integration Risk',
    agreementParties: 'Target Company LLC, Investment Partners...',
    forceMajeureClause: 'Disputed',
    assignmentProvisionSummary:
      'Assignment void if integration incomplete...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
  {
    id: 20,
    selected: false,
    fileName: 'Pandemic and Health Crises',
    agreementParties: 'World Health Organization, CDC Guidelines...',
    forceMajeureClause: 'Not Disputed',
    assignmentProvisionSummary:
      'Force majeure provisions apply to pandemics...',
    snowflake: 'Real or perceived errors, failures, or security breaches could result in claims against us, damage to our reputation, loss of customers, regulatory expenditures.',
    zscaler: 'While we have achieved broad customer diversification, our enterprise segment includes several large customers whose contract renewals or expansions significantly impact our quarterly results.',
  },
];

// Risk text variations based on the provided sample
const riskTextVariations = [
  "Biopharmaceutical product development is a highly speculative undertaking and involves a substantial degree of risk. We are a clinical-stage oncology company with a limited operating history upon which you can evaluate our business and prospects. We commenced operations in 2018, have no products approved for commercial sale, and have not generated any revenue from the sale of our products. To date, we have focused primarily on organizing and staffing our company, business planning, raising capital, building our proprietary Spyglass platform, discovering our ecDTx, developing our ecDNA diagnostic.",
  
  "We have incurred significant operating losses since our inception and expect to incur significant losses for the foreseeable future. We do not have any products approved for sale and have not generated any revenue since our inception. If we are unable to successfully develop, obtain requisite approval for and commercialize our ecDTx, we may never generate revenue. Our net losses were $45.9 million and $49.4 million for the years ended December 31, 2022 and 2023, respectively.",
  
  "To become and remain profitable, we must succeed in discovering, developing, obtaining regulatory approvals for, and eventually commercializing products that generate significant revenue. This will require us to be successful in a range of challenging activities, including completing clinical trials and preclinical studies of our ecDTx, discovering additional ecDTx, obtaining regulatory approval for these ecDTx and, if required, our ecDNA diagnostic, and manufacturing, marketing, and selling any products.",
  
  "We are in only the preliminary stages of these activities. We may never succeed in these activities and, even if we do, may never generate revenue that is significant enough to achieve profitability. In addition, we have not yet demonstrated an ability to successfully overcome many of the risks and uncertainties frequently encountered by companies in new and rapidly evolving fields, particularly in the biopharmaceutical industry.",
  
  "Because of the numerous risks and uncertainties associated with biopharmaceutical product development, we are unable to accurately predict the timing or amount of increased expenses or when, or if, we will be able to achieve profitability. Even if we do achieve profitability, we may not be able to sustain or increase profitability on a quarterly or annual basis. Our failure to become and remain profitable may have an adverse effect on the value of our company.",
  
  "Our scientific approach to the discovery and development of ecDTx, including our use of the Spyglass platform, is unproven, and we do not know whether we will be able to develop or obtain regulatory approval for any products of commercial value. In addition, we have only two ecDTx, BBI-355 and BBI-825, in early clinical development, and our other ecDTx programs remain in the preclinical or discovery stage.",
  
  "We have not yet completed any clinical trials, successfully developed and validated a diagnostic test, obtained regulatory approvals, manufactured products at commercial scale, or arranged for a third party to do so on our behalf, or conducted sales and marketing activities necessary for successful product commercialization. Consequently, any predictions made about our future success or viability may not be as accurate.",
  
  "Substantially all of our losses have resulted from expenses incurred in connection with our research and development programs and from general and administrative costs associated with our operations. All of our ecDTx will require substantial additional development time and resources before we would be able to apply for or receive regulatory approvals and begin generating revenue from product sales.",
  
  "We expect to continue to incur losses for the foreseeable future, and we anticipate these losses will increase substantially as we continue our development of, seek regulatory approval for, and potentially commercialize any of our ecDTx and seek to discover and develop additional ecDTx, as well as operate as a public company. A decline in the value of our company could cause you to lose all or part of your investment.",
  
  "Our business operations are subject to numerous risks and uncertainties, including those outside of our control, that could cause our actual results to be harmed, including risks inherent in the development of biopharmaceutical products. We have limited experience in conducting clinical trials and no experience in commercializing products, which may adversely affect our ability to achieve regulatory approval."
];

// Function to get a random variation for each cell
const getRandomRiskText = () => {
  return riskTextVariations[Math.floor(Math.random() * riskTextVariations.length)];
};


// AnimationOverlay component removed - no longer needed without loading states

interface SelectedCompany {
  id: string;
  name: string;
  logo?: string;
  s1Url?: string;
}

interface ReviewTableProps {
  selectedCompanies?: SelectedCompany[];
  alignment?: 'top' | 'center' | 'bottom';
  textWrap?: boolean;
}

export default function ReviewTable({ selectedCompanies = [], alignment = 'top', textWrap = true }: ReviewTableProps) {
  // State for selected rows
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  // Get vertical alignment style based on alignment prop
  const getVerticalAlign = () => {
    switch (alignment) {
      case 'center':
        return 'middle';
      case 'bottom':
        return 'bottom';
      default:
        return 'top';
    }
  };
  
  // Handle row selection
  const toggleRowSelection = React.useCallback((rowId: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);
  
  // Handle select all
  const toggleSelectAll = React.useCallback(() => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(row => row.id)));
    }
  }, [selectedRows.size]);
  
  // Check if all rows are selected
  const isAllSelected = selectedRows.size === data.length && selectedRows.size > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;
  
  // Generate random text once for each cell and memoize it
  const selectedCompanyIds = selectedCompanies.map(c => c.id).join(',');
  const cellTexts = React.useMemo(() => {
    const texts: Record<string, string | null> = {};
    data.forEach(row => {
      selectedCompanies.forEach(company => {
        const key = `${row.id}-${company.id}`;
        // Add some randomness to simulate extraction failures
        // About 10% of cells will be empty
        const shouldBeEmpty = Math.random() < 0.1;
        texts[key] = shouldBeEmpty ? null : getRandomRiskText();
      });
    });
    return texts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyIds]);

  const columns = React.useMemo(() => {
    const baseColumns: ColumnDef<Document>[] = [
      {
        id: 'select',
        size: 48,
        enableResizing: false,
        header: () => (
          <div className='flex justify-center'>
            <Checkbox 
              checked={isAllSelected}
              onCheckedChange={toggleSelectAll}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => {
          const isSelected = selectedRows.has(row.original.id);
          const isHovered = hoveredRow === row.original.id;
          const showCheckbox = isSelected || isHovered;
          
          return (
            <div className='flex justify-center h-full items-center'>
              {showCheckbox ? (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleRowSelection(row.original.id)}
                  aria-label={`Select row ${row.index + 1}`}
                />
              ) : (
                <span className="text-neutral-500">{row.index + 1}</span>
              )}
            </div>
          );
        },
      },
      {
        id: 'fileName',
        accessorFn: (row) => row.fileName,
        header: () => (
          <div className='flex items-center gap-1'>
            <TriangleAlertIcon />
            <span>Risk Theme</span>
          </div>
        ),
        size: 220,
        minSize: 150,
        maxSize: 400,
        cell: ({ getValue }) => (
          <span className={`block ${textWrap ? '' : 'truncate'}`} style={{ 
            whiteSpace: textWrap ? 'normal' : 'nowrap',
            wordBreak: textWrap ? 'break-word' : 'normal'
          }}>{getValue() as string}</span>
        ),
      },
    ];

    // Dynamically add columns for each selected company
    selectedCompanies.forEach((company) => {
      baseColumns.push({
        id: company.id,
        accessorFn: (row) => row[company.id] as string,
        header: () => (
          <div className='flex items-center gap-1.5'>
            <img 
              src={company.logo || "/latham-logo.jpg"} 
              alt={company.name} 
              className="w-3 h-3 rounded-full object-cover" 
            />
            <a 
              href={company.s1Url || "https://www.sec.gov/Archives/edgar/data/1535527/000104746919003095/a2238800zs-1.htm"}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors cursor-pointer hover:text-neutral-900"
              style={{ textDecoration: 'none', color: '#514E48' }}
            >
              {company.name}
            </a>
          </div>
        ),
        size: 280,
        minSize: 200,
        maxSize: 500,
        cell: ({ getValue, row }) => {
          const cellKey = `${row.original.id}-${company.id}`;
          const cellText = cellTexts[cellKey];
          const value = getValue() || cellText;
          
          if (value === null || value === '') {
            return (
              <div className="text-neutral-400" style={{ fontSize: '12px', lineHeight: '16px' }}>
                No information
              </div>
            );
          }
          
          return (
            <div
              className={textWrap ? "overflow-y-auto" : "overflow-hidden text-ellipsis"}
              style={{ 
                maxHeight: textWrap ? '120px' : 'none',
                wordBreak: textWrap ? 'break-word' : 'normal',
                whiteSpace: textWrap ? 'normal' : 'nowrap',
                lineHeight: '1.4',
                maxWidth: '100%'
              }}
            >
              {String(value)}
            </div>
          );
        },
      });
    });

    return baseColumns;
  }, [selectedCompanies, cellTexts, isAllSelected, selectedRows, hoveredRow, toggleSelectAll, toggleRowSelection, textWrap]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange' as ColumnResizeMode,
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 50,
    },
  });

  return (
    <div className='relative h-full min-w-0'>
      <div className='inline-block relative overflow-hidden'>
        <table 
          className={`border-separate border-spacing-0 border-b border-[#ECEBE9] ${
            table.getState().columnSizingInfo.isResizingColumn ? 'select-none' : ''
          }`} 
          style={{ width: table.getCenterTotalSize() }}
        >
          <colgroup>
            {table.getAllColumns().map((column) => (
              <col 
                key={column.id} 
                style={{ 
                  width: column.getSize()
                }} 
              />
            ))}
          </colgroup>
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`px-3 h-8 text-left font-medium relative ${
                    header.index !== 0 ? 'border-l border-[#ECEBE9]' : ''
                  } border-b border-[#ECEBE9]`}
                  style={{ 
                    fontSize: '12px', 
                    lineHeight: '16px', 
                    color: '#514E48',
                    width: header.column.getSize(),
                    position: 'relative'
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute right-0 top-0 cursor-col-resize select-none touch-none group`}
                      style={{
                        width: '4px',
                        height: '2000px',
                        transform: 'translateX(50%)',
                        zIndex: 10,
                      }}
                    >
                      {/* Visual line that appears on hover or when resizing */}
                      <div
                        className={`absolute left-1/2 top-0 h-full transition-opacity ${
                          header.column.getIsResizing() 
                            ? 'bg-neutral-900 opacity-100' 
                            : 'bg-neutral-400 opacity-0 group-hover:opacity-100'
                        }`}
                        style={{
                          width: '1.5px',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            const isRowSelected = selectedRows.has(row.original.id);
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const cellPadding = 'px-3 py-2';
                  const isSelectColumn = cell.column.id === 'select';
                  return (
                    <td
                      key={cell.id}
                      className={`${cellPadding} ${isRowSelected ? 'bg-[#FAFAF9]' : 'bg-white'} ${cell.column.id !== table.getAllColumns()[0].id ? 'border-l border-[#ECEBE9]' : ''} border-b border-[#ECEBE9] relative ${isSelectColumn ? 'cursor-pointer' : ''}`}
                    style={{ 
                      fontSize: '12px', 
                      lineHeight: '16px', 
                      minHeight: '32px', 
                      maxHeight: '140px', 
                      verticalAlign: getVerticalAlign(),
                      width: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                      overflow: 'hidden'
                    }}
                    onMouseEnter={isSelectColumn ? () => setHoveredRow(row.original.id) : undefined}
                    onMouseLeave={isSelectColumn ? () => setHoveredRow(null) : undefined}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
