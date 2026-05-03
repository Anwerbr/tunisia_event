'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MapPin, AlertCircle } from 'lucide-react'
import type { UserRole } from '@/lib/types'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'user' as UserRole
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    const result = await register({
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone || undefined,
      role: formData.role
    })
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Registration failed')
    }
    
    setIsLoading(false)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-8 w-8" />
              <span className="text-2xl font-bold">TunisiaEvents</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join TunisiaEvents to discover and book events</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+216 XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel>Account Type</FieldLabel>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => updateField('role', value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="user" id="role-user" />
                    <label htmlFor="role-user" className="text-sm cursor-pointer">
                      Attendee
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="organizer" id="role-organizer" />
                    <label htmlFor="role-organizer" className="text-sm cursor-pointer">
                      Event Organizer
                    </label>
                  </div>
                </RadioGroup>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              Create Account
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
