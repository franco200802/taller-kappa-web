#!/usr/bin/env bash
# Genera las variantes responsive de las fotos de producto.
#
# Fuente: assets-src/fotos/<nombre>.jpg (el original, fuera de public/ para
# no publicarlo dos veces). Salida en public/images/:
#   <nombre>.jpg                     tamaño completo: og:image, JSON-LD, sitemap
#   <nombre>-<ancho>.{avif,webp,jpg} variantes para srcset (components/Picture.jsx)
#
# Para reemplazar una foto (por ejemplo, por una real del taller): pisar el
# archivo en assets-src/fotos/ con el MISMO nombre, correr este script desde
# react-app/ y, si cambió la proporción, actualizar width/height donde se
# usa (data/products.js y las páginas). Si se agrega una foto nueva, sumarla
# también a RESPONSIVE en components/Picture.jsx.
#
# Requiere ImageMagick 7 (convert/magick) con soporte AVIF y WebP.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets-src/fotos
OUT=public/images
WIDTHS=(480 800 1200 1600)

for src in "$SRC"/*.jpg; do
  name=$(basename "$src" .jpg)
  width=$(identify -format '%w' "$src")
  # Tamaño completo en JPG progresivo, sin metadatos.
  convert "$src" -strip -interlace Plane -sampling-factor 4:2:0 -quality 82 "$OUT/$name.jpg"
  # Anchos estándar que entran en el original, más el ancho original.
  sizes=()
  for w in "${WIDTHS[@]}"; do (( w < width )) && sizes+=("$w"); done
  sizes+=("$width")
  for w in "${sizes[@]}"; do
    convert "$src" -strip -resize "${w}x" -interlace Plane -sampling-factor 4:2:0 -quality 78 "$OUT/$name-$w.jpg"
    convert "$src" -strip -resize "${w}x" -quality 72 -define webp:method=6 "$OUT/$name-$w.webp"
    convert "$src" -strip -resize "${w}x" -quality 50 "$OUT/$name-$w.avif"
  done
  echo "  $name ($width px): listo"
done
