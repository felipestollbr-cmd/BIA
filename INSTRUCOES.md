# 🚀 Como Publicar o NeuroTrack-BIA

## Método 1: Script Automático (Recomendado)

Execute o script de instalação que criei:

```bash
cd /Users/felipestoll/Desktop/BIA
./install-and-publish.sh
```

Este script vai:
1. ✅ Instalar Homebrew (se necessário)
2. ✅ Instalar Node.js e npm
3. ✅ Instalar todas as dependências do projeto
4. ✅ Instalar Expo CLI

---

## Método 2: Instalação Manual

### Passo 1: Instalar Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Passo 2: Instalar Node.js
```bash
brew install node
```

### Passo 3: Instalar dependências
```bash
cd /Users/felipestoll/Desktop/BIA
npm install
npm install -g expo-cli
```

---

## Como Publicar

### Opção A: Expo Go (Mais Rápido - Testar Imediatamente)

```bash
# 1. Fazer login no Expo
npx expo login

# 2. Iniciar servidor de desenvolvimento
npx expo start
```

**Escanear QR Code:**
- iOS: Abrir Câmera → Escanear QR
- Android: Abrir Expo Go → Escanear QR

### Opção B: Build Nativo (App Instalável)

```bash
# 1. Configurar EAS
npm install -g eas-cli
eas login

# 2. Configurar projeto
eas build:configure

# 3. Build para iOS
eas build --platform ios --profile preview

# 4. Build para Android
eas build --platform android --profile preview
```

---

## Opção C: Usar Expo Snack (Online - Sem Instalação)

1. Acesse: https://snack.expo.dev
2. Crie um novo projeto
3. Copie os arquivos do BIA para o Snack
4. Execute diretamente no navegador ou no seu celular

---

## Estrutura do Projeto

```
BIA/
├── app/                    # Telas principais
│   ├── (tabs)/
│   │   ├── index.tsx      # Dashboard
│   │   ├── neuro.tsx      # Monitoramento
│   │   ├── therapy.tsx    # Terapia Cognitiva
│   │   └── caregiver.tsx  # Painel Cuidador
├── components/            # Componentes reutilizáveis
├── services/              # Integração HealthKit/Health Connect
├── store/                 # Estado global (Zustand)
└── types/                 # Tipos TypeScript
```

---

## Problemas Comuns

### Erro: "command not found: npm"
**Solução:** Execute o script de instalação ou instale Node.js manualmente

### Erro: "Cannot find module 'expo'"
**Solução:** 
```bash
cd /Users/felipestoll/Desktop/BIA
npm install
```

### Erro: "Metro bundler failed to start"
**Solução:** 
```bash
npx expo start --clear
```

### Permissões HealthKit não funcionam
**Solução:** 
- iOS: Certifique-se de que as permissões estão configuradas no `app.json`
- Android: Necessário build nativo para Health Connect funcionar

---

## Recursos Adicionais

- **Documentação Expo:** https://docs.expo.dev
- **Expo Go (iOS):** https://apps.apple.com/app/apple-store/id982107779
- **Expo Go (Android):** https://play.google.com/store/apps/details?id=host.exp.exponent
- **EAS Build:** https://docs.expo.dev/build/introduction/

---

## Suporte

Para dúvidas sobre o NeuroTrack-BIA, consulte o README.md do projeto.
