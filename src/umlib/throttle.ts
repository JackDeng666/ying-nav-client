let t2: number | null = null

export default function throttle(callback: Function, delay: number) {
  if (t2) return
  callback()
  t2 = setTimeout(function () {
    t2 = null
  }, delay)
}
