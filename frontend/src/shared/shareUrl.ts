export function getShareUrl(): string {
  let url = window.location.href;
  if (url.includes("localhost")) {
    url = url.replace(/http:\/\/localhost:\d+/, "https://juan-pablo-lopez.github.io");
  }
  return url;
}
