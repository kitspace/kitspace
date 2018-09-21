export function checkGravatar(url) {
  return RegExp('/!gitlab/uploads/-/system/user/avatar/').test(url)
}
