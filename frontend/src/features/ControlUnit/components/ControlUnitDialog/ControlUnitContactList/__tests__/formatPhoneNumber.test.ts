import { describe, expect, it } from '@jest/globals'

import { formatPhoneNumber } from '../Item'

describe('Phone Number format', () => {
  it('should format international number starting with 00 then 3 by 3', async () => {
    // Given
    const phoneNumber = '00111222333444'

    // When
    const formattedNumber = formatPhoneNumber(phoneNumber)

    // Then
    expect(formattedNumber).toEqual('00 111 222 333 444')
  })

  it('should format international french number starting with 00 then 2 by 2', async () => {
    // Given
    const phoneNumber = '003344556677'

    // When
    const formattedNumber = formatPhoneNumber(phoneNumber)

    // Then
    expect(formattedNumber).toEqual('00 33 44 55 66 77')
  })

  it('should format french number 2 by 2', async () => {
    // Given
    const phoneNumber = '0122334455'

    // When
    const formattedNumber = formatPhoneNumber(phoneNumber)

    // Then
    expect(formattedNumber).toEqual('01 22 33 44 55')
  })

  it('should format other format 3 by 3', async () => {
    // Given
    const phoneNumber = '+33123456789100'

    // When
    const formattedNumber = formatPhoneNumber(phoneNumber)

    // Then
    expect(formattedNumber).toEqual('+33 123 456 789 100')
  })
})
