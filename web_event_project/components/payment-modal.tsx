'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import type { Event } from '@/lib/types'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  event: Event
  quantity: number
  onSuccess: (ticketCode: string) => void
}

export function PaymentModal({ open, onClose, event, quantity, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [ticketCode, setTicketCode] = useState('')

  const totalPrice = event.ticket_price * quantity

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number')
      return
    }
    if (expiry.length < 5) {
      setError('Please enter a valid expiry date')
      return
    }
    if (cvc.length < 3) {
      setError('Please enter a valid CVC')
      return
    }
    if (!name.trim()) {
      setError('Please enter the cardholder name')
      return
    }

    setStep('processing')

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create the ticket
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          quantity
        })
      })

      const data = await res.json()

      if (data.success) {
        setTicketCode(data.ticket.ticket_code)
        setStep('success')
      } else {
        setError(data.error || 'Payment failed')
        setStep('payment')
      }
    } catch {
      setError('Payment failed. Please try again.')
      setStep('payment')
    }
  }

  const handleClose = () => {
    if (step === 'success') {
      onSuccess(ticketCode)
    }
    setStep('payment')
    setCardNumber('')
    setExpiry('')
    setCvc('')
    setName('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Complete Payment
              </DialogTitle>
              <DialogDescription>
                Enter your card details to complete the booking
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">
                {quantity} ticket{quantity > 1 ? 's' : ''} x {event.ticket_price.toFixed(2)} TND
              </p>
              <p className="text-lg font-bold mt-2">Total: {totalPrice.toFixed(2)} TND</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium">Demo Mode</p>
              <p>Use test card: 4242 4242 4242 4242</p>
              <p>Any future expiry, any 3-digit CVC</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Card Number</FieldLabel>
                  <Input
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Expiry</FieldLabel>
                    <Input
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>CVC</FieldLabel>
                    <Input
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Cardholder Name</FieldLabel>
                  <Input
                    placeholder="Name on card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="w-full mt-4">
                <Lock className="h-4 w-4 mr-2" />
                Pay {totalPrice.toFixed(2)} TND
              </Button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center">
            <Spinner className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Processing payment...</p>
            <p className="text-sm text-muted-foreground">Please do not close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your ticket has been booked successfully.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">Ticket Code</p>
              <p className="font-mono font-bold text-lg">{ticketCode}</p>
            </div>
            <Button onClick={handleClose} className="w-full">
              View My Ticket
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
