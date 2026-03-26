export interface City {
  slug: string;
  name: string;
  state: string;
  stateAbbr: string;
  tier: 1 | 2 | 3 | 4;
}

export const cities: City[] = [
  // Tier 1 — Maiores mercados
  { slug: "sao-paulo", name: "São Paulo", state: "São Paulo", stateAbbr: "SP", tier: 1 },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", state: "Rio de Janeiro", stateAbbr: "RJ", tier: 1 },
  { slug: "belo-horizonte", name: "Belo Horizonte", state: "Minas Gerais", stateAbbr: "MG", tier: 1 },
  { slug: "brasilia", name: "Brasília", state: "Distrito Federal", stateAbbr: "DF", tier: 1 },
  { slug: "curitiba", name: "Curitiba", state: "Paraná", stateAbbr: "PR", tier: 1 },

  // Tier 2 — Capitais grandes
  { slug: "salvador", name: "Salvador", state: "Bahia", stateAbbr: "BA", tier: 2 },
  { slug: "fortaleza", name: "Fortaleza", state: "Ceará", stateAbbr: "CE", tier: 2 },
  { slug: "recife", name: "Recife", state: "Pernambuco", stateAbbr: "PE", tier: 2 },
  { slug: "porto-alegre", name: "Porto Alegre", state: "Rio Grande do Sul", stateAbbr: "RS", tier: 2 },
  { slug: "goiania", name: "Goiânia", state: "Goiás", stateAbbr: "GO", tier: 2 },
  { slug: "manaus", name: "Manaus", state: "Amazonas", stateAbbr: "AM", tier: 2 },
  { slug: "belem", name: "Belém", state: "Pará", stateAbbr: "PA", tier: 2 },

  // Tier 3 — Regiões metropolitanas e cidades grandes
  { slug: "campinas", name: "Campinas", state: "São Paulo", stateAbbr: "SP", tier: 3 },
  { slug: "guarulhos", name: "Guarulhos", state: "São Paulo", stateAbbr: "SP", tier: 3 },
  { slug: "sao-bernardo-do-campo", name: "São Bernardo do Campo", state: "São Paulo", stateAbbr: "SP", tier: 3 },
  { slug: "santo-andre", name: "Santo André", state: "São Paulo", stateAbbr: "SP", tier: 3 },
  { slug: "osasco", name: "Osasco", state: "São Paulo", stateAbbr: "SP", tier: 3 },
  { slug: "niteroi", name: "Niterói", state: "Rio de Janeiro", stateAbbr: "RJ", tier: 3 },
  { slug: "sao-goncalo", name: "São Gonçalo", state: "Rio de Janeiro", stateAbbr: "RJ", tier: 3 },
  { slug: "ribeirao-preto", name: "Ribeirão Preto", state: "São Paulo", stateAbbr: "SP", tier: 3 },
  { slug: "sorocaba", name: "Sorocaba", state: "São Paulo", stateAbbr: "SP", tier: 3 },

  // Tier 4 — Capitais e cidades relevantes
  { slug: "florianopolis", name: "Florianópolis", state: "Santa Catarina", stateAbbr: "SC", tier: 4 },
  { slug: "vitoria", name: "Vitória", state: "Espírito Santo", stateAbbr: "ES", tier: 4 },
  { slug: "natal", name: "Natal", state: "Rio Grande do Norte", stateAbbr: "RN", tier: 4 },
  { slug: "joao-pessoa", name: "João Pessoa", state: "Paraíba", stateAbbr: "PB", tier: 4 },
  { slug: "sao-luis", name: "São Luís", state: "Maranhão", stateAbbr: "MA", tier: 4 },
  { slug: "maceio", name: "Maceió", state: "Alagoas", stateAbbr: "AL", tier: 4 },
  { slug: "campo-grande", name: "Campo Grande", state: "Mato Grosso do Sul", stateAbbr: "MS", tier: 4 },
  { slug: "cuiaba", name: "Cuiabá", state: "Mato Grosso", stateAbbr: "MT", tier: 4 },
  { slug: "londrina", name: "Londrina", state: "Paraná", stateAbbr: "PR", tier: 4 },
];
