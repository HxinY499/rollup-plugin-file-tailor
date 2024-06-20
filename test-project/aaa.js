export default async function () {
  const { name } = await import('./bbb.js');
  return name;
}
