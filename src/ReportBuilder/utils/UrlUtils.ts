/**
 * Generates cUrl
 * @param body Body
 * @param path Relative path
 */
export function generateCUrl(body: string, path: string) {
  return `curl -XPOST -H "Content-type: application/json" -d '${body}' '${process.env.PEEKDATA_API_URL}${path}'`;
}