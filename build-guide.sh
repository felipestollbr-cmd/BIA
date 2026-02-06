#!/bin/bash

echo "🚀 NeuroTrack-BIA - Build & Deploy"
echo "======================================"
echo ""

cd /Users/felipestoll/Desktop/BIA

echo "📦 Opção 1: Build APK (Android)"
echo "   Comando: eas build --platform android --profile preview"
echo ""
echo "📦 Opção 2: Build IPA (iOS)"  
echo "   Comando: eas build --platform ios --profile preview"
echo ""
echo "☁️ Opção 3: Publicar no Expo (Sem build)"
echo "   Comando: npx expo publish"
echo ""
echo "⚠️ Todas as opções requerem login no Expo"
echo ""
echo "Para criar conta: https://expo.dev/signup"
echo ""
echo "Depois de criar conta, execute:"
echo "  npx expo login"
echo ""
