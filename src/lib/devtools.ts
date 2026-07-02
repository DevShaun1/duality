/**
 * Returns an object containing a `data-component` attribute for development mode.
 * This can be used to add a data attribute to a component for debugging purposes.
 * 
 * @param componentName - The name of the component.
 * @returns An object with a `data-component` attribute if in development mode, otherwise an empty object.
 */
export function devComponentAttrs(componentName: string): { 'data-component'?: string } {
  return import.meta.env.DEV ? { 'data-component': componentName } : {};
}
