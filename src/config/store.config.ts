export interface StoreConfig {
  name: string;
  tagline: string;
  description: string;
  logo: {
    text: string;
    subtext?: string;
    imageUrl?: string;
  };
  contact: {
    email: string;
    whatsapp: string;
    address: string;
    social: {
      instagram?: string;
    };
  };
  appearance: {
    theme: 'light';
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  currency: {
    symbol: string;
    code: string;
    locale: string;
  };
}

export const STORE_CONFIG: StoreConfig = {
  name: 'SUA MARCA',
  tagline: 'Camisetas essenciais com estética contemporânea e minimalista.',
  description: 'Moda autoral pensada para o cotidiano urbano com materiais de alta qualidade e corte preciso.',
  logo: {
    text: 'SUA MARCA',
    subtext: 'STUDIO',
  },
  contact: {
    email: 'contato@suamarca.com.br',
    whatsapp: '+55 (11) 99999-9999',
    address: 'São Paulo - SP, Brasil',
    social: {
      instagram: 'https://instagram.com/suamarca',
    },
  },
  appearance: {
    theme: 'light',
    primaryColor: '#171717',
    accentColor: '#737373',
    fontFamily: 'Inter, sans-serif',
  },
  currency: {
    symbol: 'R$',
    code: 'BRL',
    locale: 'pt-BR',
  },
};
