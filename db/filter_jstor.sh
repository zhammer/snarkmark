#!/bin/bash
# Filter JSTOR .jsonl data
# Usage: ./filter_jstor.sh input.jsonl > output.jsonl

jq -c 'select(
  .title and
  .creators_string and
  (.languages | type == "array" and contains(["eng"])) and
  .published_date > "2020-01-01" and
  (if .content_type == "book_part" then .content_subtype == "chapter" else true end) and
  (if .content_type == "article" then .content_subtype | IN("editorial", "book-review", "research-article", "review-article", "review-essay") else true end)
)' "$1"
