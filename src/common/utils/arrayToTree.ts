export function menuArrayToTree(arr, parent_id = 0) {
  return arr
    .filter((item) => Number(item.parent_id) === parent_id) // 过滤出所有父级匹配的项
    .map((item) => ({
      id: item.id,
      path: item.path,
      menuName: item.locale,
      icon: item.icon,
      orderNo: item.sort,
      type: item.type.toString(),
      createTime: item.create_time,
      component: item.component,
      status: item.status,
      meta: {
        title: item.locale,

        hidden: item.hideInMenu,
      },
      children: menuArrayToTree(arr, item.id), // 递归转换子级
    }));
}

// const obj = menuArrayToTree(list, 0);
// export function menuArrayToTree(data) {
//   const result = [];
//   const map = {};
//   if (!Array.isArray(data)) {
//     //验证data是不是数组类型
//     return [];
//   }
//   data.forEach((item) => {
//     //建立每个数组元素id和该对象的关系
//     map[item.id] = item; //这里可以理解为浅拷贝，共享引用
//     // console.log(map);
//   });
//   data.forEach((item) => {
//     const parent = map[item.parent_id]; //找到data中每一项item的爸爸
//     if (parent) {
//       //说明元素有爸爸，把元素放在爸爸的children下面
//       (parent.children || (parent.children = [])).push(item);
//     } else {
//       const obj = {
//         path: item.path,
//         name: item.name,
//         component: item.component ? item.component : 'LAYOUT',
//         mate: {
//           title: item.locale,
//           icon: item.icon,
//           orderNo: item.sort,
//           hidden: item.hideInMenu,
//           children: [],
//         },
//       };
//       //说明元素没有爸爸，是根节点，把节点push到最终结果中
//       result.push(obj); //item是对象的引用
//     }
//   });
//   return result; //数组里的对象和data是共享的
// }
