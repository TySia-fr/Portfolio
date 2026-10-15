#!/usr/bin/env bash
# Deploys one image tag of the portfolio and rolls back if it is unhealthy.
#
# It is installed as an SSH *forced command* for the deploy key, so the CI
# key can run this script and nothing else. The requested tag arrives in
# $SSH_ORIGINAL_COMMAND and is treated as untrusted input.

set -Eeuo pipefail

readonly APP_DIR="/opt/portfolio"
readonly CONTAINER="portfolio"
readonly STATE_FILE="${APP_DIR}/.current-tag"
readonly HEALTH_TIMEOUT_S=60

log() { printf '[deploy] %s\n' "$*"; }

# 1. Validate input: only a full 40-character git SHA is accepted.
#    Anything else (spaces, ';', '$(...)', 'latest') is rejected.
requested="${SSH_ORIGINAL_COMMAND:-${1:-}}"
if [[ ! "${requested}" =~ ^[0-9a-f]{40}$ ]]; then
  log "refused: expected a 40-character commit SHA" >&2
  exit 2
fi

cd "${APP_DIR}"
previous="$(cat "${STATE_FILE}" 2>/dev/null || true)"

start() {
  IMAGE_TAG="$1" docker compose up -d --remove-orphans
}

wait_healthy() {
  local waited=0 status
  while (( waited < HEALTH_TIMEOUT_S )); do
    status="$(docker inspect -f '{{.State.Health.Status}}' "${CONTAINER}" 2>/dev/null || echo missing)"
    if [[ "${status}" == "healthy" ]]; then return 0; fi
    sleep 2
    (( waited += 2 ))
  done
  return 1
}

# 2. Pull first: if the image does not exist, nothing running is touched.
log "pulling ${requested}"
IMAGE_TAG="${requested}" docker compose pull --quiet

# 3. Swap and verify.
log "starting ${requested}"
start "${requested}"

if wait_healthy; then
  echo "${requested}" > "${STATE_FILE}"
  log "healthy — deployed ${requested}"
  # Remove images older than a week that no container uses.
  docker image prune -af --filter "until=168h" >/dev/null || true
  exit 0
fi

# 4. Automatic rollback.
log "UNHEALTHY after ${HEALTH_TIMEOUT_S}s — last logs:" >&2
docker logs --tail 40 "${CONTAINER}" >&2 || true

if [[ -n "${previous}" ]]; then
  log "rolling back to ${previous}" >&2
  start "${previous}"
  wait_healthy && log "rollback healthy" >&2
else
  log "no previous version to roll back to" >&2
fi
exit 1
