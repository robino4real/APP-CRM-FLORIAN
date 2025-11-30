import React, { useMemo, useState } from 'react';
import { currency, parseNumber, findSkuDetails } from '../utils';

const SalesTable = ({ ventes, catalogue }) => {
  const [search, setSearch] = useState('');
  const [payment, setPayment] = useState('');
  const [nature, setNature] = useState('');

  const filtered = useMemo(() => {
    return ventes.filter((sale) => {
      const haystack = `${sale.Client || ''} ${sale.SKU || ''} ${sale.VenteID || ''}`.toLowerCase();
      const searchMatch = haystack.includes(search.toLowerCase());
      const paymentMatch = payment ? sale.MoyenPaiement === payment : true;
      const natureMatch = nature ? sale.Nature === nature : true;
      return searchMatch && paymentMatch && natureMatch;
    });
  }, [ventes, search, payment, nature]);

  return (
    <div className="card">
      <div className="flex-between">
        <h3>Ventes</h3>
        <div className="badge">Recherche instantanée</div>
      </div>
      <div className="input-row">
        <div>
          <label>Recherche client / SKU</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Client, SKU, ID" />
        </div>
        <div>
          <label>Moyen de paiement</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">Tous</option>
            {[...new Set(ventes.map((v) => v.MoyenPaiement).filter(Boolean))].map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Nature</label>
          <select value={nature} onChange={(e) => setNature(e.target.value)}>
            <option value="">Toutes</option>
            {[...new Set(ventes.map((v) => v.Nature).filter(Boolean))].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>ID</th>
              <th>Client</th>
              <th>SKU</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Montant TTC (u)</th>
              <th>Total</th>
              <th>Paiement</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sale) => {
              const skuDetails = findSkuDetails(sale.SKU, catalogue);
              const lineTotal = parseNumber(sale.Montant_TTC) * parseNumber(sale.Quantite || 1);
              return (
                <tr key={sale.VenteID}>
                  <td>{sale.Date}</td>
                  <td>{sale.VenteID}</td>
                  <td>{sale.Client}</td>
                  <td>{sale.SKU}</td>
                  <td>{skuDetails?.Label || '—'}</td>
                  <td>{sale.Quantite}</td>
                  <td>{currency(parseNumber(sale.Montant_TTC))}</td>
                  <td>{currency(lineTotal)}</td>
                  <td>{sale.MoyenPaiement}</td>
                </tr>
              );
            })}
            {!filtered.length ? (
              <tr>
                <td colSpan={9}>Aucune vente trouvée.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
