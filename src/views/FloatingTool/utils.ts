export function setCss(obj: any, oAttr: any) {
  let sName = ''
  const aName = ['Webkit', 'Moz', 'O']
  for (sName in oAttr) {
    if (sName.charAt(0) === '$') {
      for (let i = 0; i < aName.length; i++) {
        obj.style[aName[i] + sName.substring(1)] = oAttr[sName]
      }
    } else {
      obj.style[sName] = oAttr[sName]
    }
  }
}

export function toMove(obj: any, delay: number, bType: boolean) {
  if (bType) {
    // 出去
    const oXY = getXY(obj.deg, 60)
    setCss(obj, {
      $Transition: '0.3s ' + delay + 'ms all ease',
      $Transform: 'rotate(-360deg)',
      left: -Math.round(oXY.x) + 'px',
      top: -Math.round(oXY.y) + 'px'
    })
  } else {
    // 返回
    setCss(obj, {
      $Transition: '0.3s ' + delay + 'ms all ease',
      $Transform: 'rotate(0deg)',
      left: '0px',
      top: '0px'
    })
  }
}

export function getXY(iDeg: number, iRadius: number) {
  if (iDeg == 0) {
    return { x: 0, y: iRadius }
  } else if (iDeg == 90) {
    return { x: iRadius, y: 0 }
  }
  return {
    x: Math.sin((iDeg * Math.PI) / 180) * iRadius,
    y: Math.cos((iDeg * Math.PI) / 180) * iRadius
  }
}
