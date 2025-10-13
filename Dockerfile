# Etapa 1: Build
FROM oven/bun:1 AS builder

WORKDIR /app

# Copia arquivos do projeto
COPY package.json bun.lock ./
RUN bun install

COPY . .

# Gera build de produção do Vite
RUN bun run build

# Etapa 2: Servidor leve para servir a build
FROM oven/bun:1

WORKDIR /app

# Copia build final
COPY --from=builder /app/dist ./dist

# Instala servidor estático (serve)
RUN bun add -g serve

EXPOSE 3000

# Comando padrão: servir a build
CMD ["serve", "-s", "dist", "-l", "3000"]
