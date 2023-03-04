export function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

export function spArr(arr: any[], num: number) {
  const newArr = []
  for (let i = 0; i < arr.length; ) {
    newArr.push(arr.slice(i, (i += num)))
  }
  return newArr
}

export function getElementPosition(element: HTMLElement) {
  let top = element.offsetTop //这是获取元素距父元素顶部的距离
  let left = element.offsetLeft
  let current: HTMLElement | null = element.offsetParent as HTMLElement //这是获取父元素
  while (current !== null) {
    //当它上面有元素时就继续执行
    top += current.offsetTop //这是获取父元素距它的父元素顶部的距离累加起来
    left += current.offsetLeft
    current = current.offsetParent as HTMLElement //继续找父元素
  }
  return {
    top,
    left
  }
}

export function moveArrItem(arr: any[], cKey: any, oKey: any) {
  // arr目标数组  cKey移动元素下标，oKey目标元素下标
  if (cKey > oKey) {
    arr.splice(oKey, 0, arr[cKey]) // 移动到指定元素之前
    arr.splice(cKey + 1, 1) // 移除原来位置上的该元素
  } else {
    const temp = arr[cKey]
    arr.splice(cKey, 1) // 移除原来位置上的该元素
    arr.splice(oKey - 1, 0, temp) // 移动到指定元素之前
  }
}

export function swapArrItem(arr: any[], cKey: any, oKey: any) {
  const temp = arr[cKey]
  arr[cKey] = arr[oKey]
  arr[oKey] = temp
}

export function promiseResolve<T>(data: T, time: number) {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, time)
  })
}

export function promiseReject<T>(data: T, time: number) {
  return new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(data)
    }, time)
  })
}
