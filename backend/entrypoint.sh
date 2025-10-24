#!/bin/sh
# Ce script s'assure que les migrations de la base de données sont appliquées avant de démarrer le serveur.
# 'set -e' garantit que le script s'arrêtera si une commande échoue, ce qui est important pour le débogage.
set -e

echo "Running database migrations..."
# Applique les migrations en attente à la base de données.
npx prisma migrate deploy

echo "Migrations complete. Starting the server..."
# Exécute la commande principale passée au conteneur (le CMD du Dockerfile).
exec "$@"