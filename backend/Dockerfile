# --- Étape 1: Le "Builder" ---
# Cette étape installe toutes les dépendances, y compris celles de développement, et compile le code.
FROM node:18-slim AS builder

# Installer OpenSSL, une dépendance requise par les binaires de Prisma dans un environnement Linux
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copier les fichiers de dépendances et les installer pour profiter de la mise en cache de Docker
COPY package*.json ./
RUN npm install

# Copier le reste du code source de l'application
COPY . .

# Générer le client Prisma pour s'assurer qu'il est disponible pour la compilation
RUN npx prisma generate

# Compiler le code TypeScript en JavaScript
RUN npm run build

# --- Étape 2: Production ---
    FROM node:18-slim AS production
    RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
    WORKDIR /app
    
    # 1) ننسخو ملفات الـ deps و نثبتو prod deps
    COPY --from=builder /app/package*.json ./
    RUN npm ci --omit=dev || npm install --omit=dev
    
    # 2) ننسخو prisma قبل الـ generate
    COPY --from=builder /app/prisma ./prisma
    
    # 3) نولّدو الـ client داخل صورة الـ production
    # (ما نحتاجوش devDependency "prisma"؛ نستعمل npx باش يجيب CLI مؤقتاً)
    RUN npx --yes prisma@5.22.0 generate --schema=prisma/schema.prisma
    
    # 4) ننسخو الكود المجمّع
    COPY --from=builder /app/dist ./dist
    
    # 5) entrypoint + صلاحية
    COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
    RUN chmod +x ./entrypoint.sh
    
    EXPOSE 3000
    ENTRYPOINT ["/app/entrypoint.sh"]
    # بدّل الملف حسب الموجود فعلياً:
    CMD ["node","dist/server.js"]   # أو ["node","dist/main.js"]
    