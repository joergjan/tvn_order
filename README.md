## about

dockerisierte & lokale Anwendung für einen Raspberry Pi, um an der Abendunterhaltung Essensbestellungen am Handy aufzunehmen, damit diese direkt in der Küche ersichtlich sind.

## install & run

```
docker build . -t trigye-sveltekit
```

```
npm run dev
```

and don't forget to execute this in the docker terminal

```
npx prisma db push
```

### changes to docker-compose or Dockerfile

```
docker compose up -d --build
```

www.tvnussbaumen.ch
