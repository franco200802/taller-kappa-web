#!/usr/bin/env bash
# Genera, desde las fotos de assets-src/fotos/, las variantes que NO son responsive:
#   <nombre>-16x9.jpg  1200x675  og:image / twitter:image (previews de WhatsApp, redes, Discover)
#   <nombre>-4x3.jpg   1200x900  imagen adicional del Product (Google pide 1:1, 4:3 y 16:9)
# La foto original (1:1 o vertical) se muestra ENTERA sobre un fondo desenfocado de la
# misma foto: no se recorta el producto. Es un script aparte de build-images.sh para
# no volver a codificar las variantes responsive existentes.
#
# Si se reemplaza una foto en assets-src/fotos/, correr este script desde react-app/
# además de build-images.sh. Requiere ImageMagick 7 (convert).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets-src/fotos
OUT=public/images

for src in "$SRC"/*.jpg; do
  name=$(basename "$src" .jpg)
  for spec in 16x9:1200x675 4x3:1200x900; do
    ratio=${spec%%:*}; size=${spec#*:}; height=${size#*x}
    convert "$src" -strip -resize "${size}^" -gravity center -extent "$size" -blur 0x28 -modulate 100,90 \
      \( "$src" -strip -resize "x${height}" \) -gravity center -composite \
      -interlace Plane -sampling-factor 4:2:0 -quality 82 "$OUT/$name-$ratio.jpg"
  done
  echo "  $name: 16x9 y 4x3 listos"
done
