#!/usr/bin/env bash
set -e

MSG="${1:-chore: atualiza arquivos do projeto Survivors}"

echo "Adicionando alterações..."
git add .

if git diff --cached --quiet; then
    echo "Nenhuma alteração pendente para commit."
    exit 0
fi

echo "Criando commit: $MSG"
git commit -m "$MSG"

echo "Enviando para o GitHub (origin main)..."
git push origin main

echo "Concluído com sucesso!"
