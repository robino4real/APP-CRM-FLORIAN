export const currency = (value) => new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
}).format(value || 0);

export const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const num = Number(String(value).replace(',', '.'));
  return Number.isNaN(num) ? 0 : num;
};

export const groupByMonth = (rows, dateKey, valueGetter) => {
  const totals = rows.reduce((acc, row) => {
    const date = new Date(row[dateKey]);
    if (Number.isNaN(date)) return acc;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + valueGetter(row);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const aggregateMetrics = ({ ventes, commandes, achats }, salaryConfig) => {
  const totalSales = ventes.reduce((sum, sale) => sum + parseNumber(sale.Montant_TTC) * parseNumber(sale.Quantite || 1), 0);
  const totalPurchase = achats.reduce((sum, row) => sum + parseNumber(row.PU_HT) * parseNumber(row.Quantite || 1) * (1 + parseNumber(row.TVA) / 100), 0);
  const totalOrders = commandes.reduce((sum, row) => sum + parseNumber(row.Montant_HT) * 1.2 + parseNumber(row.FraisPortTTC || 0), 0);
  const grossProfit = totalSales - totalPurchase - totalOrders;

  const monthlySalaryBase = totalSales * 0.2;
  const adjustedSalary = monthlySalaryBase - parseNumber(salaryConfig.localCost || 0) - parseNumber(salaryConfig.otherDeductions || 0) + parseNumber(salaryConfig.bonus || 0);

  return {
    totalSales,
    totalPurchase,
    totalOrders,
    grossProfit,
    monthlySalaryBase,
    adjustedSalary
  };
};

export const findSkuDetails = (sku, catalogue) => catalogue.find((item) => item.SKU === sku);

export const topSuppliers = (achats) => {
  const totals = achats.reduce((acc, row) => {
    const value = parseNumber(row.PU_HT) * parseNumber(row.Quantite || 1);
    acc[row.Fournisseur] = (acc[row.Fournisseur] || 0) + value;
    return acc;
  }, {});
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

export const paymentBreakdown = (ventes) => {
  const totals = ventes.reduce((acc, row) => {
    acc[row.MoyenPaiement || 'Autre'] = (acc[row.MoyenPaiement || 'Autre'] || 0) + parseNumber(row.Montant_TTC) * parseNumber(row.Quantite || 1);
    return acc;
  }, {});
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
};

export const shippingCosts = (commandes) => commandes.reduce((sum, row) => sum + parseNumber(row.FraisPortTTC), 0);
