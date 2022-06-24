declare global {
  type Invoice = {
    id?: number;
    invoice: string;
    client: string;
    invoice_value: number;
  }

  type InvoiceCalculated = {
    pis: number;
    cofins: number;
    iss: number;
    liquid_value: number;
    csll: number; 
  } & Invoice
}

export {}