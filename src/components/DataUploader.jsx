import React from 'react';
import Papa from 'papaparse';

const DataUploader = ({ label, description, onData, requiredHeaders }) => {
  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        onData(Array.isArray(data) ? data : []);
      }
    });
  };

  return (
    <div className="card">
      <div className="flex-between">
        <div>
          <h3>{label}</h3>
          <p className="help-text">{description}</p>
        </div>
        <span className="chip">CSV</span>
      </div>
      <input type="file" accept=".csv,text/csv" onChange={handleFile} />
      {requiredHeaders?.length ? (
        <p className="help-text">Colonnes attendues : {requiredHeaders.join(', ')}</p>
      ) : null}
    </div>
  );
};

export default DataUploader;
