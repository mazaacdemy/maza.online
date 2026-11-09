# Port map - Maza Academy — maza.online

> **This port is RESERVED for this project only** - do not reuse it for another project.
> Central source: `localhost-dashboard\projects.json` (edit there, not here).

| Field | Value |
|---|---|
| **Local port** | `9109` |
| **Windows service** | `Proj-Maza` |
| **Folder** | `Maza Academy Local\maza.online` |
| **Type** | Next.js (webpack) |
| **Status** | READY - service installed |
| **Runner** | npm |
| **URL** | http://127.0.0.1:9109 |

## Manual run

```
cd "D:\000_My Programs\Maza Academy Local\maza.online"
node.exe node_modules\next\dist\bin\next dev --webpack -p 9109
```

Open: http://127.0.0.1:9109

## Environment variables

- (none)

## Service control (from the dashboard)

Dashboard: **http://127.0.0.1:7777/** - buttons (start) / (stop) / (restart) next to this project.

Or from an **elevated** PowerShell:

```
sc.exe query Proj-Maza
sc.exe stop Proj-Maza
net start Proj-Maza
```

The service is set to **delayed auto-start with Windows boot** and restarts itself if it crashes.

## Logs

`localhost-dashboard\svc-logs\Proj-Maza.out.log` and `.err.log`

## Docker option (optional)

If you ever want to run it in Docker instead of the service, use this snippet in `docker-compose.yml`:

```yaml
services:
  maza:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - "Maza Academy Local/maza.online:/app"
    command: sh -c "node node_modules/next/dist/bin/next dev --webpack -p 9109"
    ports:
      - "9109:9109"
    restart: unless-stopped
```

> **Warning:** changing the port here means updating `projects.json` AND reinstalling the
> service. The port is **reserved** and must not be taken by another project.

---
*Auto-generated from projects.json - 2026-11-09*
