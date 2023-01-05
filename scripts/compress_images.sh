#! /bin/bash

set -e

images=(static/gallery/*.*)

echo $images

for ((i=0; i<$((${#images[@]})); i++)); do

    file="${images[$i]}"

    filename="${file##*/}"
    basename="$(basename -- "${filename%.*}")"
    dir="${file%/*}"

    mkdir $dir/$basename
    mv $file $dir/$basename/$filename
    file=$dir/$basename/$filename

    cwebp $file -q 80 -o $dir/$basename/$basename.webp &
    npx avif --input=$file --output=$dir/$basename --quality=65 &

done