#!/bin/bash

echo "🔧 Corrigindo limite de arquivos abertos..."

# Aumentar limite temporário
ulimit -n 65536

echo "✅ Limite aumentado para: $(ulimit -n)"

# Limpar cache
echo "🧹 Limpando cache..."
cd /Users/felipestoll/Desktop/BIA
rm -rf node_modules/.cache
rm -rf .expo
rm -rf dist

echo "🚀 Iniciando servidor Expo..."
npx expo start --localhost

echo "
📱 IMPORTANTE:
- Use o computador e celular na MESMA rede Wi-Fi
- OU use o iOS Simulator / Android Emulator
- OU pressione 'w' para abrir no navegador web
"
