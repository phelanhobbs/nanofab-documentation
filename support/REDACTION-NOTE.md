# Redaction Note

This GitHub documentation copy redacts literal credential values that were present in the local documentation:

- CORES bearer token value.
- Lab WiFi password value.

The surrounding known-issues text is preserved so maintainers still know those secrets exist in source and should be moved to protected storage and rotated.

`support/path-f-reconstruction/` also contains sanitized source excerpts generated from the sibling source repos. Secret-looking literal values in those excerpts are replaced with placeholders such as `<redacted-secret-value>`, `<redacted-bearer-token>`, or `<redacted-long-token>`. Those placeholders document where a value exists; they are not recoverable credentials.
