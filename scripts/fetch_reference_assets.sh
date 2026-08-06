#!/usr/bin/env bash
set -euo pipefail

UPSTREAM_COMMIT='4d02e4aadcef2f8f6b92d2e55b43e8d61e8ce39e'
BASE_URL="https://raw.githubusercontent.com/drammock/phonetics-teaching-assets/${UPSTREAM_COMMIT}"
DEST='site/assets/vendor/phonetics'
mkdir -p "$DEST"

fetch_and_verify() {
  local remote_path="$1"
  local destination="$2"
  local expected_blob_sha="$3"

  curl --fail --silent --show-error --location --retry 3 \
    "${BASE_URL}/${remote_path}" \
    --output "${destination}"

  local actual_blob_sha
  actual_blob_sha="$(git hash-object "${destination}")"
  if [[ "${actual_blob_sha}" != "${expected_blob_sha}" ]]; then
    echo "Reference asset hash mismatch: ${destination}" >&2
    echo "expected=${expected_blob_sha} actual=${actual_blob_sha}" >&2
    exit 1
  fi
}

fetch_and_verify \
  'midsaggital_articulations/consonants/svg/neutral.svg' \
  "${DEST}/neutral.svg" \
  'fed35bbdaf29939a4d8601e1449e2153767d7f74'

fetch_and_verify \
  'midsaggital_articulations/vowels/svg/i.svg' \
  "${DEST}/vowel_i.svg" \
  '4d0f137ed8608cb7df2b65564a0b1c6b9f9f5ff9'
