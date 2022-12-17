# [qbittorrent-windscribe-ephemeral-port](https://github.com/EnumC/qbittorrent-windscribe-ephemeral-port)

Automatically create ephemeral ports in windscribe and update qbittorrent config to use the new port.
Also exports the new port as iptables rule for Gluetun.

This repo is for qbittorrent only. For Deluge, check out the original repo this qbittorrent version is forked from: [deluge-windscribe-ephemeral-port](https://github.com/dumbasPL/deluge-windscribe-ephemeral-port)


## Important information

This project was designed to work along side containers like [linuxserver/qbittorrent](https://docs.linuxserver.io/images/docker-qbittorrent) in mind.  
It will not help you route qbittorrent traffic through a VPN! For that, you can use [qdm12/gluetun](https://github.com/qdm12/gluetun). What it will do is to update the listening port of qbittorrent to the allocated Windscribe port.

# Configuration

Configuration is done using environment variables

| Variable | Description | Required | Default |
| :-: | :-: | :-: | :-: |
| WINDSCRIBE_USERNAME | username you use to login at windscribe.com/login | YES |  |
| WINDSCRIBE_PASSWORD | password you use to login at windscribe.com/login | YES |  |
| CLIENT_URL | The URL for the qbittorrent web UI (eg: http://localhost:8080) | YES |  |
| CLIENT_USERNAME | The username for the qbittorrent web UI | YES |  |
| CLIENT_PASSWORD | The password for the qbittorrent web UI | YES |  |
| CRON_SCHEDULE | An extra cron schedule used to periodically validate and update the port if needed. Disabled if left empty | NO |  |
| WINDSCRIBE_RETRY_DELAY | how long to wait (in milliseconds) before retrying after a windscribe error. For example a failed login. | NO | 3600000 (1 hour) |
| WINDSCRIBE_EXTRA_DELAY | how long to wait (in milliseconds) after the ephemeral port expires before trying to create a new one. | NO | 60000 (1 minute) |
| CLIENT_RETRY_DELAY | how long to wait (in milliseconds) before retrying after a qbittorrent error. For example a failed login. | NO | 300000 (5 minutes) |
| CACHE_DIR | A directory where to store cached data like windscribe session cookies | NO | `/cache` in the docker container and `./cache` everywhere else |
| GLUETUN_DIR | A directory where to write iptables entry for gluetun | NO | `/post-rules.txt` in the docker container and `./post-rules.txt` everywhere else |
| GLUETUN_IFACE | Gluetun vpn interface name | NO | `tun0` |

# Running

## Using docker (and docker compose in this example)

```yaml
version: '3.8'
services:
  qbittorrent-windscribe-ephemeral-port:
    image: enumc/qbittorrent-windscribe-ephemeral-port:latest
    restart: unless-stopped
    volumes:
      - windscribe-cache:/cache
    environment:
      - WINDSCRIBE_USERNAME=<your windscribe username>
      - WINDSCRIBE_PASSWORD=<your windscribe password>
      - CLIENT_URL=<url of your qbittorrent Web UI>
      - CLIENT_USERNAME=<username for the qbittorrent Web UI>
      - CLIENT_PASSWORD=<password for the qbittorrent Web UI>

      # optional
      # - CLIENT_RETRY_DELAY=300000
      # - WINDSCRIBE_RETRY_DELAY=3600000
      # - WINDSCRIBE_EXTRA_DELAY=60000
      # - CRON_SCHEDULE=
      # - CACHE_DIR=/cache
      # - GLUETUN_DIR=/post-rules.txt
      # - GLUETUN_IFACE=tun0

volumes:
  - windscribe-cache:
  # optional
  # - ./post-rules.txt:/post-rules.txt
```

## Using nodejs

**This project requires Node.js version 16 or newer**  
**This project uses [yarn](https://classic.yarnpkg.com/) to manage dependencies, make sure you have it installed first.**

1. clone this repository
2. Install dependencies by running `yarn install`
3. Create a `.env` file in the root of the project with the necessary configuration
```shell
WINDSCRIBE_USERNAME=<your windscribe username>
WINDSCRIBE_PASSWORD=<your windscribe password>
CLIENT_URL=<url of your qbittorrent Web UI>
CLIENT_USERNAME=<username of your qbittorrent Web UI>
CLIENT_PASSWORD=<password for the qbittorrent Web UI>

# optional
# CLIENT_HOST_ID=
# WINDSCRIBE_RETRY_DELAY=3600000
# WINDSCRIBE_EXTRA_DELAY=60000
# CRON_SCHEDULE=
# CACHE_DIR=./cache
```
4. Build and start using `yarn install`

Tip: you can use tools like pm2 to manage nodejs applications
