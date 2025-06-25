<template>
  <USelect
    v-model="modelValueProxy"
    :items="topicsProp"
    :placeholder="placeholder"
    class="mb-4"
    clearable
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  topics: {
    type: Array,
    default: () => [
      'Barn/ungdom', 'Besöksnäring', 'Byggande', 'Demokrati', 'Digitalisering', 'Djur/natur',
      'Ekonomi', 'Energi', 'EU', 'Forskning', 'Hållbarhet', 'Infrastruktur/kommunikationer',
      'Innovation', 'Integration/mångfald', 'Internationella frågor', 'Jämställdhet',
      'Klimat/miljö', 'Kommunikation/information', 'Kultur', 'Mat', 'Media/journalistik',
      'Mänskliga rättigheter', 'Näringsliv', 'Partiets halvdag', 'Regionfrågor', 'Religion',
      'Rättsväsende/brott', 'Sysselsättning/arbetsmarknad', 'Säkerhet/försvar', 'Utbildning',
      'Vård och Omsorg', 'Yttrandefrihet', 'Äldre', 'Annat',
    ],
  },
  placeholder: {
    type: String,
    default: 'Välj ämne (valfritt)',
  },
})
const emit = defineEmits(['update:modelValue'])
const topicsProp = computed(() => props.topics)
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script> 