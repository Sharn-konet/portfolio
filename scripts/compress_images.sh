#! /bin/bash

set -e

images=(static/gallery/*.*)

for ((i=1; i<${#images[@]}; i++)); do
    file="${images[$i]}"

    filename="${file##*/}"
    basename="$(basename -- "${filename%.*}")"
    dir="${file%/*}"

    mkdir $dir/$basename

    cwebp $file -q 50 -o $dir/$basename/$basename.webp
    npx avif --input=${images[$i]} --output=$dir/$basename
    mv $file $dir/$basename/$filename
done