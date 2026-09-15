FROM node:24-bookworm-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000 DATABASE_PATH=/data/auth.db
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node scripts/serve.mjs ./scripts/serve.mjs
COPY --chown=node:node server ./server
COPY --chown=node:node auth ./auth
COPY --chown=node:node index.html avg-enter.js flow.js prefetch-duty.json prefetch-elevator.json ./
COPY --chown=node:node assets ./assets
COPY --chown=node:node mobile ./mobile
COPY --chown=node:node avg ./avg
COPY --chown=node:node duty ./duty
COPY --chown=node:node elevator ./elevator
RUN mkdir -p /data && chown node:node /data && chmod 700 /data
USER node
VOLUME /data
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s CMD node -e "fetch('http://127.0.0.1:8000/api/auth/me').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "scripts/serve.mjs"]
