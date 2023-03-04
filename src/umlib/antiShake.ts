let timeOut: number | null = null
export default function (fn: Function, time: number) {
  if (timeOut) {
    clearTimeout(timeOut)
  }
  timeOut = setTimeout(() => {
    fn()
  }, time)
}
