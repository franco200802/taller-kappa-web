/**
 * ShimmerText — un destello de color que recorre las letras en bucle.
 *
 * Basado en el componente "Shimmer Text" de KokonutUI (kokonutui.com), reimplementado con
 * CSS puro (ver `.shimmer-text` en global.css). El destello va del color del texto al rojo de
 * marca y vuelve: en ningún punto de la animación baja del contraste AA sobre el fondo claro.
 * Con prefers-reduced-motion (o colores forzados) queda como texto normal. Es texto real en el
 * DOM, así que se lee, se copia y se indexa igual que cualquier otro.
 */
export default function ShimmerText({ children, className = '' }) {
  return <span className={`shimmer-text ${className}`}>{children}</span>;
}
