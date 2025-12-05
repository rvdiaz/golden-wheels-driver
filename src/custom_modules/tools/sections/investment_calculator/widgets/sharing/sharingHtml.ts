import { toolsDisclaimers } from '~/custom_modules/tools/data';
import { formatCurrency, formatPercentage } from '../../helpers';
import { CalculationResults } from '../../interfaces';

interface EmailTemplateOptions {
  includeUnits?: boolean;
  includeProjections?: boolean;
  summarize?: boolean; // For mailto compatibility
}

/**
 * Generates an HTML email template from calculation results
 * Can be used for mailto links or backend PDF/web generation
 */
export const generateInvestmentHTML = (
  results: CalculationResults,
  options: EmailTemplateOptions = { includeUnits: true, includeProjections: true, summarize: false }
): string => {
  const { includeUnits = true, includeProjections = true, summarize = false } = options;

  // For mailto, we need a more compact version
  if (summarize) {
    return generatePlainTextSummary(results, formatCurrency, formatPercentage);
  }

  // Full detailed HTML for backend/web
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investment Analysis Results</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1f2937;
            font-size: 28px;
            margin-bottom: 24px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 12px;
        }
        h2 {
            color: #374151;
            font-size: 20px;
            margin-top: 32px;
            margin-bottom: 16px;
            border-left: 4px solid #3b82f6;
            padding-left: 12px;
        }
        .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }
        .card {
            border: 2px solid;
            border-radius: 8px;
            padding: 16px;
        }
        .current-card {
            background-color: #fef3c7;
            border-color: #f59e0b;
        }
        .improved-card {
            background-color: #dcfce7;
            border-color: #16a34a;
        }
        .card-title {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 12px;
        }
        .current-card .card-title {
            color: #92400e;
        }
        .improved-card .card-title {
            color: #166534;
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .metric-label {
            font-size: 14px;
            font-weight: 500;
            color: #4b5563;
        }
        .metric-value {
            font-size: 18px;
            font-weight: 700;
        }
        .current-card .metric-value {
            color: #d97706;
        }
        .improved-card .metric-value {
            color: #059669;
        }
        .summary-card {
            background-color: #dbeafe;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .summary-title {
            color: #1e40af;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            text-align: center;
        }
        .summary-item {
            padding: 8px;
        }
        .summary-label {
            font-size: 12px;
            color: #1e40af;
            margin-bottom: 4px;
            font-weight: 500;
        }
        .summary-value {
            font-size: 20px;
            font-weight: 700;
            color: #1e40af;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }
        .metric-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            background: #f9fafb;
        }
        .metric-card-title {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }
        .metric-card-value {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 4px;
        }
        .metric-card-subtitle {
            font-size: 12px;
            color: #6b7280;
        }
        .units-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        .units-table th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #d1d5db;
        }
        .units-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .units-table tr:hover {
            background-color: #f9fafb;
        }
        .projections-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }
        .projection-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            background: #fefce8;
        }
        .projection-title {
            font-size: 16px;
            font-weight: 600;
            color: #854d0e;
            margin-bottom: 12px;
        }
        .projection-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .projection-label {
            color: #78716c;
        }
        .projection-value {
            font-weight: 600;
            color: #44403c;
        }
        .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .comparison-grid,
            .summary-grid,
            .metrics-grid,
            .projections-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Investment Analysis Results</h1>
        
        <!-- Current vs Improved Comparison -->
        <h2>Performance Comparison</h2>
        <div class="comparison-grid">
            <div class="card current-card">
                <div class="card-title">Current Performance</div>
                <div class="metric-row">
                    <span class="metric-label">Cap Rate:</span>
                    <span class="metric-value">${formatPercentage(results.currentCapRate)}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Annual Income:</span>
                    <span class="metric-value">${formatCurrency(results.totalIncome - results.totalIncomeIncrease)}</span>
                </div>
            </div>
            
            <div class="card improved-card">
                <div class="card-title">After Improvements</div>
                <div class="metric-row">
                    <span class="metric-label">Cap Rate:</span>
                    <span class="metric-value">${formatPercentage(results.improvedCapRate)}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Annual Income:</span>
                    <span class="metric-value">${formatCurrency(results.totalIncome)}</span>
                </div>
            </div>
        </div>
        
        <!-- Investment Summary -->
        <div class="summary-card">
            <div class="summary-title">Investment Analysis Summary</div>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-label">Total Repair Investment</div>
                    <div class="summary-value">${formatCurrency(results.totalRepairCosts)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Annual Income Increase</div>
                    <div class="summary-value">${formatCurrency(results.totalIncomeIncrease)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Estimated Value Gain</div>
                    <div class="summary-value">${formatCurrency(results.valueGain)}</div>
                </div>
            </div>
        </div>
        
        <!-- Key Metrics -->
        <h2>Key Performance Metrics</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-card-title">Cash-on-Cash Return</div>
                <div class="metric-card-value">${formatPercentage(results.cashOnCashReturn)}</div>
                <div class="metric-card-subtitle">Annual return on cash invested</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-card-title">Annual Cash Flow</div>
                <div class="metric-card-value">${formatCurrency(results.annualCashFlow)}</div>
                <div class="metric-card-subtitle">${formatCurrency(results.annualCashFlow / 12)}/month</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-card-title">Net Operating Income</div>
                <div class="metric-card-value">${formatCurrency(results.netOperatingIncome)}</div>
                <div class="metric-card-subtitle">After all operating expenses</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-card-title">Debt Service Coverage</div>
                <div class="metric-card-value">${results.debtServiceCoverageRatio.toFixed(2)}x</div>
                <div class="metric-card-subtitle">
                    ${
                      results.debtServiceCoverageRatio >= 1.25
                        ? 'Strong Coverage'
                        : results.debtServiceCoverageRatio >= 1.0
                          ? 'Adequate Coverage'
                          : 'Insufficient Coverage'
                    }
                </div>
            </div>
        </div>
        
        ${
          includeUnits && results.units.length > 0
            ? `
        <!-- Unit Details -->
        <h2>Unit Breakdown</h2>
        <table class="units-table">
            <thead>
                <tr>
                    <th>Unit</th>
                    <th>Current Rent</th>
                    <th>Potential Rent</th>
                    <th>Repair Costs</th>
                    <th>Increase</th>
                </tr>
            </thead>
            <tbody>
                ${results.units
                  .map(
                    (unit, index) => `
                <tr>
                    <td>Unit ${index + 1}</td>
                    <td>${formatCurrency(unit.currentRent * 12)}</td>
                    <td>${formatCurrency(unit.potentialRent * 12)}</td>
                    <td>${formatCurrency(unit.repairCosts)}</td>
                    <td>${formatCurrency((unit.potentialRent - unit.currentRent) * 12)}</td>
                </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
        `
            : ''
        }
        
        ${
          includeProjections
            ? `
        <!-- Future Projections -->
        <h2>Future Projections</h2>
        <div class="projections-grid">
            <div class="projection-card">
                <div class="projection-title">3-Year Projection</div>
                <div class="projection-item">
                    <span class="projection-label">Projected Rent:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year3.rent)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Property Value:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year3.propertyValue)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Cash Flow:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year3.cashFlow)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Equity:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year3.equity)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Cap Rate:</span>
                    <span class="projection-value">${formatPercentage(results.projections.year3.capRate)}</span>
                </div>
            </div>
            
            <div class="projection-card">
                <div class="projection-title">5-Year Projection</div>
                <div class="projection-item">
                    <span class="projection-label">Projected Rent:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year5.rent)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Property Value:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year5.propertyValue)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Cash Flow:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year5.cashFlow)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Equity:</span>
                    <span class="projection-value">${formatCurrency(results.projections.year5.equity)}</span>
                </div>
                <div class="projection-item">
                    <span class="projection-label">Cap Rate:</span>
                    <span class="projection-value">${formatPercentage(results.projections.year5.capRate)}</span>
                </div>
            </div>
        </div>
        `
            : ''
        }
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p>This analysis is for informational purposes only and should not be considered financial advice.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
};

/**
 * Generates a compact summary HTML for mailto links
 * Optimized to stay under 2000 character limit
 */
export const generatePlainTextSummary = (
  results: CalculationResults,
  formatCurrency: (value: number) => string,
  formatPercentage: (value: number) => string
): string => {
  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

  // First try with full details
  const fullVersion = `
  INVESTMENT ANALYSIS REPORT
  ${divider}
  
  INVESTMENT SUMMARY
  ${divider}
  Total Cash Invested:        ${formatCurrency(results.totalCashInvested)}
  Total Repair Costs:         ${formatCurrency(results.totalRepairCosts)}
  Annual Income Increase:     ${formatCurrency(results.totalIncomeIncrease)}
  Estimated Value Gain:       ${formatCurrency(results.valueGain)}
  
  PERFORMANCE METRICS
  ${divider}
  Current Cap Rate:           ${formatPercentage(results.currentCapRate)}
  Improved Cap Rate:          ${formatPercentage(results.improvedCapRate)} ↑
  Cash-on-Cash Return:        ${formatPercentage(results.cashOnCashReturn)}
  Net Operating Income:       ${formatCurrency(results.netOperatingIncome)}
  
  CASH FLOW ANALYSIS
  ${divider}
  Annual Cash Flow:           ${formatCurrency(results.annualCashFlow)}
  Monthly Cash Flow:          ${formatCurrency(results.annualCashFlow / 12)}
  Total Annual Income:        ${formatCurrency(results.totalIncome)}
  Total Annual Expenses:      ${formatCurrency(results.totalExpenses)}
  
  DEBT & COVERAGE
  ${divider}
  Debt Service Coverage:      ${results.debtServiceCoverageRatio.toFixed(2)}x
  Coverage Status:            ${
    results.debtServiceCoverageRatio >= 1.25
      ? 'Strong Coverage ✓'
      : results.debtServiceCoverageRatio >= 1.0
        ? 'Adequate Coverage'
        : 'Insufficient Coverage ✗'
  }
  
  ${
    results.units.length > 0 && results.units.length <= 3
      ? `UNIT BREAKDOWN (${results.units.length} Units)
  ${divider}
  ${results.units
    .map(
      (unit, idx) =>
        `Unit ${idx + 1}:
    Current Rent:    ${formatCurrency(unit.currentRent * 12)}/year
    Potential Rent:  ${formatCurrency(unit.potentialRent * 12)}/year
    Repair Cost:     ${formatCurrency(unit.repairCosts)}
    Income Gain:     ${formatCurrency((unit.potentialRent - unit.currentRent) * 12)}/year`
    )
    .join('\n\n')}
  
  `
      : results.units.length > 3
        ? `UNIT BREAKDOWN (${results.units.length} Units)
  ${divider}
  Total Units:                ${results.units.length}
  Avg Current Rent:           ${formatCurrency((results.units.reduce((sum, u) => sum + u.currentRent, 0) / results.units.length) * 12)}/year
  Avg Potential Rent:         ${formatCurrency((results.units.reduce((sum, u) => sum + u.potentialRent, 0) / results.units.length) * 12)}/year
  Total Repair Costs:         ${formatCurrency(results.units.reduce((sum, u) => sum + u.repairCosts, 0))}
  
  `
        : ''
  }FUTURE PROJECTIONS
  ${divider}
  3-Year Outlook:
    Property Value:            ${formatCurrency(results.projections.year3.propertyValue)}
    Annual Rent:               ${formatCurrency(results.projections.year3.rent)}
    Annual Cash Flow:          ${formatCurrency(results.projections.year3.cashFlow)}
    Equity Position:           ${formatCurrency(results.projections.year3.equity)}
    Cap Rate:                  ${formatPercentage(results.projections.year3.capRate)}
  
  5-Year Outlook:
    Property Value:            ${formatCurrency(results.projections.year5.propertyValue)}
    Annual Rent:               ${formatCurrency(results.projections.year5.rent)}
    Annual Cash Flow:          ${formatCurrency(results.projections.year5.cashFlow)}
    Equity Position:           ${formatCurrency(results.projections.year5.equity)}
    Cap Rate:                  ${formatPercentage(results.projections.year5.capRate)}
  
  ${divider}
  Generated: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
  
  This analysis is for informational purposes only.
    `.trim();

  // If full version is too long, return condensed version
  if (fullVersion.length > 1800) {
    return `
  INVESTMENT ANALYSIS REPORT
  ${divider}
  
  INVESTMENT SUMMARY
  Total Cash Invested:        ${formatCurrency(results.totalCashInvested)}
  Total Repair Costs:         ${formatCurrency(results.totalRepairCosts)}
  Annual Income Increase:     ${formatCurrency(results.totalIncomeIncrease)}
  Estimated Value Gain:       ${formatCurrency(results.valueGain)}
  
  PERFORMANCE METRICS
  Current Cap Rate:           ${formatPercentage(results.currentCapRate)}
  Improved Cap Rate:          ${formatPercentage(results.improvedCapRate)} ↑
  Cash-on-Cash Return:        ${formatPercentage(results.cashOnCashReturn)}
  Net Operating Income:       ${formatCurrency(results.netOperatingIncome)}
  
  CASH FLOW
  Annual Cash Flow:           ${formatCurrency(results.annualCashFlow)}
  Monthly Cash Flow:          ${formatCurrency(results.annualCashFlow / 12)}
  DSCR:                       ${results.debtServiceCoverageRatio.toFixed(2)}x
  
  UNITS: ${results.units.length} total
  Avg Repair Cost/Unit:       ${formatCurrency(results.totalRepairCosts / results.units.length)}
  
  PROJECTIONS
  Year 3 Value:               ${formatCurrency(results.projections.year3.propertyValue)}
  Year 5 Value:               ${formatCurrency(results.projections.year5.propertyValue)}
  
  ${divider}
  DISCLAIMER
  ${divider}
  ${toolsDisclaimers.investmentCalculator}

  Generated: ${new Date().toLocaleDateString()}
      `.trim();
  }

  return fullVersion;
};

/**
 * Generates a mailto link with the HTML email body
 * Handles encoding and character limits
 */
export const generateMailtoLink = (
  results: CalculationResults,
  options: {
    to?: string;
    subject?: string;
    cc?: string;
  } = {}
): string => {
  const { to = '', subject = 'Investment Analysis Results', cc = '' } = options;

  // Generate compact HTML for email
  const htmlBody = generateInvestmentHTML(results, { summarize: true });

  // URL encode the body
  const encodedBody = encodeURIComponent(htmlBody);

  // Build mailto URL
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (cc) params.push(`cc=${encodeURIComponent(cc)}`);
  params.push(`body=${encodedBody}`);

  const mailtoUrl = `mailto:${to}?${params.join('&')}`;

  // Warn if too long (most clients support ~2000 chars, but some support more)
  if (mailtoUrl.length > 2000) {
    console.warn(
      `Mailto URL is ${mailtoUrl.length} characters. Some email clients may truncate the content.`
    );
  }

  return mailtoUrl;
};

/**
 * Opens the device's email client with pre-populated email
 * For React Native, use with Linking.openURL
 */
export const shareViaEmail = async (
  results: CalculationResults,
  options: {
    to?: string;
    subject?: string;
    cc?: string;
  } = {}
): Promise<string> => {
  const mailtoUrl = generateMailtoLink(results, options);
  return mailtoUrl;
};
