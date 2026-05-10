<script setup lang="ts">
import type { Seat } from '~/types'

const props = withDefaults(defineProps<{
  seats: Seat[]
  selectable?: boolean
  selectedSeats?: number[]
}>(), {
  selectable: false,
  selectedSeats: () => []
})

const emit = defineEmits<{
  (event: 'toggle-seat', seatNumber: number): void
}>()

const toggleSeat = (seat: Seat) => {
  if (!props.selectable || seat.is_booked) {
    return
  }

  emit('toggle-seat', seat.seat_number)
}

const isSelected = (seatNumber: number) => props.selectedSeats.includes(seatNumber)
</script>

<template>
  <div class="grid grid-cols-5 gap-2 sm:gap-3">
    <button
      v-for="seat in seats"
      :key="seat.id"
      type="button"
      class="flex h-11 items-center justify-center rounded-xl border text-xs font-bold transition-all sm:h-12"
      :disabled="Boolean(seat.is_booked) || !selectable"
      :class="{
        'border-red-500/30 bg-red-700/80 text-white cursor-not-allowed': seat.is_booked,
        'border-amber-200/30 bg-gold text-black shadow-glow': !seat.is_booked && isSelected(seat.seat_number),
        'border-emerald-400/25 bg-emerald-600/80 text-white hover:bg-emerald-500': !seat.is_booked && selectable && !isSelected(seat.seat_number),
        'border-emerald-400/20 bg-emerald-600/80 text-white cursor-default': !seat.is_booked && !selectable
      }"
      @click="toggleSeat(seat)"
    >
      {{ seat.seat_number }}
    </button>
  </div>
</template>
