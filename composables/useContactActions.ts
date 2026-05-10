export const useContactActions = () => {
  const callHref = (phoneNumber?: string) => `tel:${(phoneNumber || '').replace(/\s+/g, '')}`
  const whatsappHref = (whatsAppNumber?: string, text = 'مرحباً، أرغب بحجز مقعد.') => {
    const cleaned = (whatsAppNumber || '').replace(/[^\d+]/g, '')
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`
  }

  return {
    callHref,
    whatsappHref
  }
}
