export function arrayToTree(array: any[], parent_id: any = null) {
  const result = [];
  for (const item of array.filter(
    (x) => Number(x.parent_id) === Number(parent_id),
  )) {
    const children = arrayToTree(array, item.id);
    if (children.length > 0) {
      item.children = children;
    }
    result.push(item);
  }
  return result;
}
