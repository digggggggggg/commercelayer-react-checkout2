import {
  AddressesContainer,
  BillingAddressForm,
  SaveAddressesButton,
  ShippingAddressForm,
} from "@commercelayer/react-components"
import { Address } from "@commercelayer/sdk"
import { useState, Fragment, useEffect, Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import { ShippingToggleProps } from "components/composite/StepCustomer"
import { ButtonCss, ButtonWrapper } from "components/ui/Button"
import { SpinnerIcon } from "components/ui/SpinnerIcon"
import { Toggle } from "components/ui/Toggle"

import { AddressSectionEmail } from "./AddressSectionEmail"
import { AddressSectionSaveForm } from "./AddressSectionSaveForm"
import { AddressSectionTitle } from "./AddressSectionTitle"
import { BillingAddressFormNew } from "./BillingAddressFormNew"
import { ShippingAddressFormNew } from "./ShippingAddressFormNew"

interface Props {
  billingAddress: Address | undefined
  shippingAddress: Address | undefined
  emailAddress: string | undefined
  hasSameAddresses: boolean
  isShipmentRequired: boolean
  isLocalLoader: boolean
  shipToDifferentAddress: boolean
  setShipToDifferentAddress: Dispatch<SetStateAction<boolean>>
  openShippingAddress: (props: ShippingToggleProps) => void
  disabledShipToDifferentAddress: boolean
  handleSave: () => void
}

export const CheckoutAddresses: React.FC<Props> = ({
  billingAddress,
  shippingAddress,
  emailAddress,
  hasSameAddresses,
  isShipmentRequired,
  isLocalLoader,
  shipToDifferentAddress,
  setShipToDifferentAddress,
  openShippingAddress,
  disabledShipToDifferentAddress,
  handleSave,
}: Props) => {
  const { t } = useTranslation()

  const [shippingAddressFill, setShippingAddressFill] = useState<
    Address | undefined
  >(shippingAddress)

  const handleToggleDifferentAddress = () => {
    return [
      setShipToDifferentAddress(!shipToDifferentAddress),
      setShippingAddressFill(undefined),
    ]
  }

  useEffect(() => {
    if (shipToDifferentAddress && hasSameAddresses) {
      setShippingAddressFill(undefined)
    }
  }, [shipToDifferentAddress])

  return (
    <Fragment>
      <AddressSectionEmail emailAddress={emailAddress} />
      <AddressesContainer shipToDifferentAddress={shipToDifferentAddress}>
        <div className="mt-4">
          <AddressSectionTitle>
            {t(`addressForm.billing_address_title`)}
          </AddressSectionTitle>
        </div>
        <BillingAddressForm autoComplete="on" errorClassName="hasError">
          <div className="mt-4">
            <BillingAddressFormNew
              billingAddress={billingAddress}
              openShippingAddress={openShippingAddress}
            />
          </div>
        </BillingAddressForm>
        {isShipmentRequired && (
          <Toggle
            disabled={disabledShipToDifferentAddress}
            data-cy="button-ship-to-different-address"
            data-status={shipToDifferentAddress}
            label={t(`addressForm.ship_to_different_address`)}
            checked={shipToDifferentAddress}
            onChange={handleToggleDifferentAddress}
          />
        )}

        {isShipmentRequired && shipToDifferentAddress && (
          <ShippingAddressForm
            autoComplete="on"
            hidden={!shipToDifferentAddress}
            errorClassName="hasError"
          >
            <AddressSectionTitle>
              {t(`addressForm.shipping_address_title`)}
            </AddressSectionTitle>
            <div className="mt-4">
              <ShippingAddressFormNew shippingAddress={shippingAddressFill} />
            </div>
          </ShippingAddressForm>
        )}
        <AddressSectionSaveForm>
          <ButtonWrapper>
            <StyledSaveAddressesButton
              disabled={isLocalLoader}
              label={
                <>
                  {isLocalLoader && <SpinnerIcon />}
                  {isShipmentRequired
                    ? t("stepCustomer.continueToDelivery")
                    : t("stepShipping.continueToPayment")}
                </>
              }
              data-cy="save-addresses-button"
              onClick={handleSave}
            />
          </ButtonWrapper>
        </AddressSectionSaveForm>
      </AddressesContainer>
    </Fragment>
  )
}

const StyledSaveAddressesButton = styled(SaveAddressesButton)`
  ${ButtonCss}
`
