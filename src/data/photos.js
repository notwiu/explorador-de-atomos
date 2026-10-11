// Fotos dos cientistas.
// Para usar uma foto, coloque o arquivo em src/assets/photos/ com o MESMO NOME do id do modelo:
//   dalton.jpg, thomson.jpg, rutherford.jpg, bohr.jpg, quantum.jpg
// (aceita .jpg, .jpeg, .png e .webp). Não precisa mexer em mais nada.
// As fotos ficam embutidas no arquivo final, então funcionam offline.
// Registre crédito e licença de cada foto em docs/conteudo-modelos.md.
const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function photoFor(id) {
  const key = Object.keys(files).find((k) => k.split('/').pop().replace(/\.[^.]+$/, '') === id)
  return key ? files[key] : null
}
