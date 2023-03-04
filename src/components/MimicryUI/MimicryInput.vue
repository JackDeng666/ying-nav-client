<template>
  <input type="text" class="mimicry-input" v-model="inputValue" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
})
</script>

<style lang="scss" scoped>
.mimicry-input {
  padding: 8px 15px;
  background-color: var(--mimicry-base-color);
  box-shadow: inset -3px -3px 9px var(--mimicry-highlight-color),
    inset 3px 3px 9px var(--mimicry-darkness-color);
  border: none;
  outline: 0;
  color: var(--mimicry-text-color);
  border-radius: 5px;
}
</style>
