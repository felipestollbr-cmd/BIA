#!/bin/bash

echo "🚀 NeuroTrack-BIA - Script de Instalação e Publicação"
echo "=================================================="
echo ""

# Verificar se Homebrew está instalado
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew não encontrado. Instalando..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Adicionar Homebrew ao PATH
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    echo "✅ Homebrew já instalado"
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "📦 Node.js não encontrado. Instalando..."
    brew install node
else
    echo "✅ Node.js já instalado ($(node --version))"
fi

# Verificar se npm está disponível
if ! command -v npm &> /dev/null; then
    echo "❌ Erro: npm não encontrado após instalação do Node.js"
    exit 1
fi

echo ""
echo "📥 Instalando dependências do projeto..."
cd /Users/felipestoll/Desktop/BIA
npm install

echo ""
echo "📦 Instalando Expo CLI..."
npm install -g eas-cli expo-cli

echo ""
echo "=================================================="
echo "✅ Instalação concluída!"
echo ""
echo "Próximos passos:"
echo ""
echo "1. Para executar localmente:"
echo "   npx expo start"
echo ""
echo "2. Para publicar no Expo:"
echo "   npx expo login"
echo "   npx expo publish"
echo ""
echo "3. Ou para criar build nativo:"
echo "   eas build --platform ios"
echo "   eas build --platform android"
echo ""
echo "=================================================="
