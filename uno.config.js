import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  rules: [
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
    [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
    [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` })],
    [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` })],
    [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
    [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` })],
    [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` })],
    [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` })],
    [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` })],
    [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px !important` })],
    [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` })],
    [/^rounded-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],
    [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })]
  ]
})
