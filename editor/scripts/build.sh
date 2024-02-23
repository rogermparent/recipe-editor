cd ../website
pnpm run build
rsync -ravHd "$CONTENT_DIRECTORY/transformed-images/" "./out/image/"
