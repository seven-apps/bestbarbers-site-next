# Hooks para Formulários de Lead

Esta pasta contém hooks reutilizáveis para formulários de lead com integração ao Ploomes CRM e redirecionamento WhatsApp.

## 🚀 Uso Rápido

Para usar o hook principal que combina todas as funcionalidades:

```tsx
import { useLeadForm } from '@/hooks';

export default function MeuFormulario() {
  const {
    formData,
    isSubmitting,
    submitError,
    handleInputChange,
    handleSubmit
  } = useLeadForm({
    onError: (error) => {
      console.error('Erro:', error);
      alert('Erro ao enviar formulário');
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Exibir erro se houver */}
      {submitError && (
        <div className="error">{submitError}</div>
      )}

      {/* Campos do formulário */}
      <input
        name="barbershopName"
        value={formData.barbershopName}
        onChange={handleInputChange}
        placeholder="Nome da barbearia"
        required
      />

      <input
        name="whatsapp"
        value={formData.whatsapp}
        onChange={handleInputChange}
        placeholder="WhatsApp (máscara automática)"
        required
      />

      {/* ... outros campos ... */}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
```

## 📚 Hooks Disponíveis

### 1. `useLeadForm` (Recomendado)

Hook principal que combina todas as funcionalidades:

```tsx
const {
  formData,           // Dados do formulário
  isSubmitting,       // Estado de envio
  submitError,        // Erro de envio (se houver)
  handleInputChange,  // Handler para mudanças nos inputs
  handleSubmit,       // Handler para envio do formulário
  resetForm,          // Função para limpar o formulário
  validateForm,       // Função para validar os dados
  isValidPhone        // Função para validar telefone atual
} = useLeadForm(options);
```

**Opções disponíveis:**
```tsx
interface UseLeadFormOptions {
  onSuccess?: () => void;           // Callback de sucesso
  onError?: (error: Error) => void; // Callback de erro
  redirectToWhatsApp?: boolean;     // Redirecionar para WhatsApp (padrão: true)
}
```

### 2. `usePhoneMask`

Para aplicar máscara de telefone:

```tsx
const { applyPhoneMask, removeMask, isValidPhone } = usePhoneMask();

const handleChange = (value: string) => {
  const maskedValue = applyPhoneMask(value);
  // maskedValue será algo como "(11) 99999-9999"
};
```

### 3. `useUtmParams`

Para gerenciar parâmetros UTM:

```tsx
const { getUtmParams, getOriginMapping } = useUtmParams();

const utmParams = getUtmParams();
// { utm_source: "matheus-contador", utm_desc: null, utm_inf: null }

const origin = getOriginMapping(utmParams);
// { originId: 120000463, originDesc: "LP - Matheus Contador", clickupId: null }
```

### 4. `usePloomesAPI`

Para integração com Ploomes CRM:

```tsx
const { submitLead, createContact, createDeal } = usePloomesAPI();

const data = {
  barbershopName: "Barbearia do João",
  ownerName: "João Silva",
  whatsapp: "(11) 99999-9999",
  monthlyRevenue: "10000",
  employeeCount: "3"
};

await submitLead(data);
```

### 5. `useWhatsAppRedirect`

Para redirecionamento WhatsApp:

```tsx
const { redirectToWhatsApp, generateWhatsAppLink } = useWhatsAppRedirect();

// Redirecionar imediatamente
redirectToWhatsApp();

// Ou gerar link personalizado
const link = generateWhatsAppLink("Mensagem personalizada");
```

## 🎯 Exemplos de Uso

### Formulário Simples

```tsx
import { useLeadForm } from '@/hooks';

export default function FormularioSimples() {
  const { formData, handleInputChange, handleSubmit, isSubmitting } = useLeadForm();

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="barbershopName"
        value={formData.barbershopName}
        onChange={handleInputChange}
        placeholder="Nome da barbearia"
      />
      <button type="submit" disabled={isSubmitting}>
        Enviar
      </button>
    </form>
  );
}
```

### Usando Hooks Individuais

```tsx
import { usePhoneMask, usePloomesAPI, useWhatsAppRedirect } from '@/hooks';

export default function FormularioCustomizado() {
  const [phone, setPhone] = useState('');
  const { applyPhoneMask } = usePhoneMask();
  const { submitLead } = usePloomesAPI();
  const { redirectToWhatsApp } = useWhatsAppRedirect();

  const handlePhoneChange = (e) => {
    const masked = applyPhoneMask(e.target.value);
    setPhone(masked);
  };

  const handleSubmit = async (data) => {
    await submitLead(data);
    redirectToWhatsApp();
  };

  return (
    <input
      value={phone}
      onChange={handlePhoneChange}
      placeholder="(11) 99999-9999"
    />
  );
}
```

## 🔧 Configuração

### Variáveis de Ambiente

Os hooks usam as seguintes configurações que podem ser customizadas:

- **Ploomes API Key**: Hardcoded no hook `usePloomesAPI`
- **WhatsApp Number**: `5531998816844` no hook `useWhatsAppRedirect`
- **UTM Mappings**: Definidos no hook `useUtmParams`

### Customização

Para customizar os mappings de UTM ou outras configurações, edite os arquivos dos hooks correspondentes em `/src/hooks/`.

## 📋 Campos do Formulário

O formulário padrão inclui os seguintes campos:

- `barbershopName` - Nome da barbearia
- `ownerName` - Nome do dono
- `whatsapp` - WhatsApp (com máscara automática)
- `monthlyRevenue` - Faturamento mensal
- `employeeCount` - Número de colaboradores

## 🚨 Tratamento de Erros

Os hooks incluem tratamento de erros automático:

- Validação de campos obrigatórios
- Validação de formato de telefone
- Erros de API do Ploomes
- Estados de loading durante envio

## 🔗 Fluxo Completo

1. **Preenchimento**: Usuário preenche o formulário
2. **Validação**: Campos são validados automaticamente
3. **Envio**: Dados são enviados para o Ploomes CRM
4. **Redirecionamento**: Usuário é redirecionado para WhatsApp com mensagem personalizada baseada nos UTMs

## 💡 Dicas

- Use `useLeadForm` para a maioria dos casos
- Use hooks individuais quando precisar de mais controle
- Todos os hooks são otimizados com `useCallback` para performance
- Os hooks são tipados com TypeScript para melhor DX
