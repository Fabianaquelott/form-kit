# @bulbe/adhesion-form-lib

Uma biblioteca React headless para formulários de adesão, desenvolvida com TypeScript e arquitetura em camadas.

## 🚀 Características

- **Headless First**: Lógica separada da apresentação para máxima flexibilidade
- **TypeScript**: Tipagem completa para melhor experiência de desenvolvimento
- **Arquitetura em Camadas**: Core (lógica) e UI (componentes) separados
- **Zustand**: Gerenciamento de estado global eficiente
- **React Hook Form + Zod**: Validação robusta de formulários
- **CSS Modules + SASS**: Estilização modular e customizável
- **Vitest**: Testes unitários configurados

## 📦 Instalação

```bash
npm install @bulbe/adhesion-form-lib
```

## 🎯 Uso Básico

### Hook Headless

```tsx
import { useAdhesionForm } from '@bulbe/adhesion-form-lib/core'

function MyCustomForm() {
  const {
    form,
    currentStep,
    navigation,
    onSubmit,
    isSubmitting
  } = useAdhesionForm({
    onSubmitSuccess: (data) => console.log('Sucesso!', data),
    onSubmitError: (error) => console.error('Erro:', error)
  })

  // Sua implementação customizada aqui...
}
```

### Componente Padrão

```tsx
import { DefaultAdhesionForm } from '@bulbe/adhesion-form-lib/ui'

function App() {
  return (
    <DefaultAdhesionForm
      onSuccess={(data) => console.log('Adesão concluída!', data)}
      onError={(error) => console.error('Erro:', error)}
    />
  )
}
```

### Componentes UI Individuais

```tsx
import { Button, Input, Label } from '@bulbe/adhesion-form-lib/ui'

function MyForm() {
  return (
    <div>
      <Label required>Nome</Label>
      <Input 
        placeholder="Digite seu nome"
        errorMessage="Campo obrigatório"
      />
      <Button isLoading variant="primary">
        Enviar
      </Button>
    </div>
  )
}
```

## 🏗️ Arquitetura

```
src/
├── core/                 # Lógica de negócio (headless)
│   ├── hooks/           # Hooks customizados
│   ├── schemas/         # Validação Zod
│   ├── state/           # Store Zustand
│   ├── api/             # Chamadas de API
│   └── types/           # Tipos TypeScript
└── ui/                  # Componentes de interface
    ├── components/      # Componentes reutilizáveis
    ├── styles/          # Temas e variáveis CSS
    └── DefaultAdhesionForm.tsx
```

## 🛠️ Desenvolvimento

### Iniciar Playground

```bash
npm run dev
```

### Build da Biblioteca

```bash
npm run build
```

### Executar Testes

```bash
npm run test
npm run test:ui  # Interface de testes
```

### Linting e Formatação

```bash
npm run lint
npm run format
```

## 📋 API Reference

### useAdhesionForm

Hook principal que gerencia todo o estado e lógica do formulário.

```tsx
interface UseAdhesionFormOptions {
  onStepChange?: (step: number) => void
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
  validateOnBlur?: boolean
  validateOnChange?: boolean
}
```

### Componentes UI

#### Button

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

#### Input

```tsx
interface InputProps {
  label?: string
  helperText?: string
  errorMessage?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}
```

## 🎨 Customização

### Temas CSS

A biblioteca usa variáveis CSS customizáveis:

```css
:root {
  --color-primary-600: #0284c7;
  --color-secondary-600: #475569;
  --font-sans: 'Inter', sans-serif;
  --radius-md: 0.375rem;
  /* ... */
}
```

### Sobrescrevendo Estilos

```scss
.my-custom-form {
  .button {
    background-color: my-custom-color;
  }
}
```

## 🔧 Configuração Azure Artifacts

Para publicar no feed privado, configure o `.npmrc`:

```
@bulbe:registry=https://pkgs.dev.azure.com/{organization}/_packaging/{feed}/npm/registry/
always-auth=true
```

## 📝 Roadmap

- [ ] Etapa 3: Dados adicionais
- [ ] Máscaras de input automáticas
- [ ] Tema dark mode
- [ ] Animações de transição
- [ ] Suporte a i18n
- [ ] Storybook para documentação

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT © Bulbe Team