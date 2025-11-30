import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import DataUploader from './components/DataUploader';
import SalesTable from './components/SalesTable';
import { aggregateMetrics, currency, groupByMonth, paymentBreakdown, shippingCosts, topSuppliers } from './utils';
import { sampleAchats, sampleCatalogue, sampleCommandes, sampleVentes } from './sampleData';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const App = () => {
  const [commandes, setCommandes] = useState(sampleCommandes);
  const [achats, setAchats] = useState(sampleAchats);
  const [ventes, setVentes] = useState(sampleVentes);
  const [catalogue, setCatalogue] = useState(sampleCatalogue);
  const [salaryConfig, setSalaryConfig] = useState({ localCost: 250, otherDeductions: 150, bonus: 0 });

  const metrics = useMemo(() => aggregateMetrics({ ventes, commandes, achats }, salaryConfig), [ventes, commandes, achats, salaryConfig]);

  const salesByMonth = useMemo(
    () => groupByMonth(ventes, 'Date', (row) => Number(row.Montant_TTC) * Number(row.Quantite || 1)),
    [ventes]
  );

  const purchasesByMonth = useMemo(
    () => groupByMonth(achats, 'Date', (row) => Number(row.PU_HT) * Number(row.Quantite || 1) * (1 + Number(row.TVA) / 100)),
    [achats]
  );

  const ordersByMonth = useMemo(
    () => groupByMonth(commandes, 'Date', (row) => Number(row.Montant_HT) * 1.2 + Number(row.FraisPortTTC || 0)),
    [commandes]
  );

  const mergedTimeline = useMemo(() => {
    const months = new Set([...salesByMonth, ...purchasesByMonth, ...ordersByMonth].map((item) => item.month));
    return [...months].sort().map((month) => ({
      month,
      ventes: salesByMonth.find((r) => r.month === month)?.value || 0,
      achats: purchasesByMonth.find((r) => r.month === month)?.value || 0,
      commandes: ordersByMonth.find((r) => r.month === month)?.value || 0
    }));
  }, [salesByMonth, purchasesByMonth, ordersByMonth]);

  const supplierData = useMemo(() => topSuppliers(achats), [achats]);
  const paymentData = useMemo(() => paymentBreakdown(ventes), [ventes]);
  const shipping = useMemo(() => shippingCosts(commandes), [commandes]);

  const handleSalaryChange = (key, value) => {
    setSalaryConfig((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  return (
    <div className="app-shell">
      <header>
        <h1>CRM / Gestion commerciale</h1>
        <p>Chargez vos CSV depuis Commandes, Achats, Ventes, Catalogue pour alimenter le cockpit.</p>
      </header>

      <main>
        <div className="grid grid-4">
          <div className="card">
            <h3>Total ventes</h3>
            <p className="section-title highlight">{currency(metrics.totalSales)}</p>
            <p className="help-text">Basé sur Ventes (TTC × Quantité)</p>
          </div>
          <div className="card">
            <h3>Achats & commandes</h3>
            <p className="section-title highlight">{currency(metrics.totalPurchase + metrics.totalOrders)}</p>
            <p className="help-text">Achats TTC + Commandes TTC + port</p>
          </div>
          <div className="card">
            <h3>Marge estimée</h3>
            <p className="section-title highlight">{currency(metrics.grossProfit)}</p>
            <p className="help-text">Ventes - Achats - Commandes</p>
          </div>
          <div className="card">
            <h3>Salaire mensuel (20% ventes)</h3>
            <p className="section-title highlight">{currency(metrics.adjustedSalary)}</p>
            <div className="small-card-list">
              <div className="small-card">
                <h4>Base</h4>
                <div className="metric">{currency(metrics.monthlySalaryBase)}</div>
              </div>
              <div className="small-card">
                <h4>Loyer / local</h4>
                <input type="number" value={salaryConfig.localCost} onChange={(e) => handleSalaryChange('localCost', e.target.value)} />
              </div>
              <div className="small-card">
                <h4>Autres postes</h4>
                <input
                  type="number"
                  value={salaryConfig.otherDeductions}
                  onChange={(e) => handleSalaryChange('otherDeductions', e.target.value)}
                />
              </div>
              <div className="small-card">
                <h4>Bonus</h4>
                <input type="number" value={salaryConfig.bonus} onChange={(e) => handleSalaryChange('bonus', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="flex-between">
              <h3>Flux mensuels</h3>
              <span className="chip">Ventes / Achats / Commandes</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={mergedTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Legend />
                <Line type="monotone" dataKey="ventes" stroke="#2563eb" name="Ventes" />
                <Line type="monotone" dataKey="achats" stroke="#10b981" name="Achats" />
                <Line type="monotone" dataKey="commandes" stroke="#f59e0b" name="Commandes" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="flex-between">
              <h3>Fournisseurs principaux</h3>
              <span className="chip">Achats</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={supplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="flex-between">
              <h3>Paiements clients</h3>
              <span className="chip">Ventes</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={paymentData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {paymentData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <p className="help-text">Répartition des ventes par moyen de paiement.</p>
          </div>

          <div className="card">
            <h3>Pense-bête gestion</h3>
            <div className="small-card-list">
              <div className="small-card">
                <h4>Frais de port cumulés</h4>
                <div className="metric">{currency(shipping)}</div>
              </div>
              <div className="small-card">
                <h4>Backups</h4>
                <p className="help-text">Sauvegardez les CSV exportés chaque semaine (cloud + disque externe).</p>
              </div>
              <div className="small-card">
                <h4>Net salary</h4>
                <p className="help-text">Salaire = 20% ventes mensuelles - loyer - autres postes + bonus.</p>
              </div>
              <div className="small-card">
                <h4>Référencement</h4>
                <p className="help-text">Utilisez les SKU du catalogue pour accélérer la saisie des commandes et ventes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <h3>Import CSV</h3>
          <p className="help-text">Remplacez les données d'exemple par vos exports : gains de performance par rapport aux fichiers Excel volumineux.</p>
          <div className="grid grid-4">
            <DataUploader
              label="Commandes"
              description="Date, RéférenceCommande, Fournisseur, NbArticles, Nature, Montant_HT, FraisPortTTC, MoyenPaiement"
              requiredHeaders={[
                'Date',
                'RéférenceCommande',
                'Fournisseur',
                'NbArticles',
                'Nature',
                'Montant_HT',
                'FraisPortTTC',
                'MoyenPaiement'
              ]}
              onData={setCommandes}
            />
            <DataUploader
              label="Achats"
              description="AchatID, Date, Fournisseur, SKU, PU_HT, TVA, Quantite"
              requiredHeaders={['AchatID', 'Date', 'Fournisseur', 'SKU', 'PU_HT', 'TVA', 'Quantite']}
              onData={setAchats}
            />
            <DataUploader
              label="Ventes"
              description="VenteID, Date, Client, SKU, Nature, MoyenPaiement, Quantite, Montant_TTC"
              requiredHeaders={['VenteID', 'Date', 'Client', 'SKU', 'Nature', 'MoyenPaiement', 'Quantite', 'Montant_TTC']}
              onData={setVentes}
            />
            <DataUploader
              label="Catalogue"
              description="SKU, Label, Famille, Marque, PrixConseilleTTC"
              requiredHeaders={['SKU', 'Label', 'Famille', 'Marque', 'PrixConseilleTTC']}
              onData={setCatalogue}
            />
          </div>
        </div>

        <SalesTable ventes={ventes} catalogue={catalogue} />
      </main>
    </div>
  );
};

export default App;
