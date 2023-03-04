import CarouselSwiper from './CarouselSwiper.vue'
import CarouselItem from './CarouselItem.vue'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.component('CarouselSwiper', CarouselSwiper)
    app.component('CarouselItem', CarouselItem)
  }
}
