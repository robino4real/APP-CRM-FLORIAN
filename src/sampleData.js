export const sampleCommandes = [
  {
    Date: '2024-05-03',
    RéférenceCommande: 'CMD-240503-AX',
    Fournisseur: 'ABC Grossiste',
    NbArticles: 25,
    Nature: 'Réassort',
    Montant_HT: 1850,
    FraisPortTTC: 60,
    MoyenPaiement: 'Carte'
  },
  {
    Date: '2024-05-12',
    RéférenceCommande: 'CMD-240512-BX',
    Fournisseur: 'Tech France',
    NbArticles: 10,
    Nature: 'Nouveauté',
    Montant_HT: 1120,
    FraisPortTTC: 40,
    MoyenPaiement: 'Virement'
  },
  {
    Date: '2024-06-02',
    RéférenceCommande: 'CMD-240602-ZY',
    Fournisseur: 'ABC Grossiste',
    NbArticles: 18,
    Nature: 'Réassort',
    Montant_HT: 1350,
    FraisPortTTC: 55,
    MoyenPaiement: 'Carte'
  }
];

export const sampleAchats = [
  {
    AchatID: 'A-1001',
    Date: '2024-05-03',
    Fournisseur: 'ABC Grossiste',
    SKU: 'PHN-128-BLK',
    PU_HT: 250,
    TVA: 20,
    Quantite: 10
  },
  {
    AchatID: 'A-1002',
    Date: '2024-05-12',
    Fournisseur: 'Tech France',
    SKU: 'HDP-1TB-SSD',
    PU_HT: 90,
    TVA: 20,
    Quantite: 15
  },
  {
    AchatID: 'A-1003',
    Date: '2024-06-02',
    Fournisseur: 'ABC Grossiste',
    SKU: 'PHN-256-SLV',
    PU_HT: 320,
    TVA: 20,
    Quantite: 8
  }
];

export const sampleVentes = [
  {
    VenteID: 'V-5001',
    Date: '2024-05-05',
    Client: 'Boutique Paris',
    SKU: 'PHN-128-BLK',
    Nature: 'Vente',
    MoyenPaiement: 'CB',
    Quantite: 2,
    Montant_TTC: 349
  },
  {
    VenteID: 'V-5002',
    Date: '2024-05-14',
    Client: 'Client Web',
    SKU: 'HDP-1TB-SSD',
    Nature: 'Vente',
    MoyenPaiement: 'Stripe',
    Quantite: 4,
    Montant_TTC: 139
  },
  {
    VenteID: 'V-5003',
    Date: '2024-06-03',
    Client: 'Boutique Lyon',
    SKU: 'PHN-256-SLV',
    Nature: 'Vente',
    MoyenPaiement: 'CB',
    Quantite: 3,
    Montant_TTC: 469
  }
];

export const sampleCatalogue = [
  {
    SKU: 'PHN-128-BLK',
    Label: 'Smartphone 128Go Noir',
    Famille: 'Téléphonie',
    Marque: 'PhoneMax',
    PrixConseilleTTC: 359
  },
  {
    SKU: 'HDP-1TB-SSD',
    Label: 'SSD Externe 1To',
    Famille: 'Stockage',
    Marque: 'HyperDrive',
    PrixConseilleTTC: 149
  },
  {
    SKU: 'PHN-256-SLV',
    Label: 'Smartphone 256Go Argent',
    Famille: 'Téléphonie',
    Marque: 'PhoneMax',
    PrixConseilleTTC: 479
  }
];
