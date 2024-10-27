// testFormBuilder.js
import FormBuilder from '@payloadcms/plugin-form-builder'

console.log(typeof FormBuilder) // Check if it's a function or something else
// If FormBuilder is a function, try to call it
if (typeof FormBuilder === 'function') {
  const result = FormBuilder({ fields: { text: true } })
  console.log(result)
}
