/** Where to send a user after login — dashboard only if they already have an assessment. */
export function getPostAuthPath(): '/dashboard' | '/assess' {
  return localStorage.getItem('cc_assessment_result') ? '/dashboard' : '/assess';
}
