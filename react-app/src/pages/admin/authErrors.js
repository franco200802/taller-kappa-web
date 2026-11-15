/** Mensajes para los códigos de error de Firebase Authentication que puede ver quien administra. */
const AUTH_ERRORS = {
  'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
  'auth/wrong-password': 'Usuario o contraseña incorrectos.',
  'auth/user-not-found': 'Usuario o contraseña incorrectos.',
  'auth/invalid-email': 'El email no tiene un formato válido.',
  'auth/missing-email': 'Escribí el email de la cuenta.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos y volvé a probar.',
  'auth/network-request-failed': 'No hay conexión con Firebase. Revisá tu conexión a internet.',
  'auth/operation-not-allowed': 'El acceso con email y contraseña no está habilitado en el proyecto de Firebase.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'La clave de Firebase (apiKey) no es válida. Revisá la configuración.',
};

export const authError = (err) => AUTH_ERRORS[err?.code] ?? `No se pudo completar la operación (${err?.code ?? 'error desconocido'}).`;
