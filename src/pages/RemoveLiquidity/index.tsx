import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, Percent, WETH } from '@sotatek-anhdao/smartdex-sdk'
import { Button, Flex, Text } from 'uikit-sotatek'
import { ArrowDown, Plus } from 'react-feather'
import { RouteComponentProps } from 'react-router'
import { TranslateString } from 'utils/translateTextHelpers'
import { BigNumber } from '@ethersproject/bignumber'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CardNav from 'components/CardNav'
import { darkColors, lightColors, baseColors } from 'style/Color'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'
import Slider from '../../components/Slider'
import CurrencyLogo from '../../components/CurrencyLogo'
import { ROUTER_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { StyledInternalLink } from '../../components/Shared'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { ClickableText, Wrapper } from '../Pool/styleds'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { Dots } from '../../components/swap/styleds'
import { useBurnActionHandlers, useDerivedBurnInfo, useBurnState } from '../../state/burn/hooks'

import { Field } from '../../state/burn/actions'
import { useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'

const OutlineCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 16px;
  padding: 24px;
`

const Body = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`

const ConnectWalletButtonStyle = styled(ConnectWalletButton)`
  margin-top: 40px;
  ${({ theme }) => theme.mediaQueries.nav} {
    margin-top: 69px;
  }
`

const IconDirect = styled.img`
  width: 10px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 16px;
  }
`

const BoxIconDirect = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  background: #0085ff;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 24px;
  text-align: center;
  line-height: 45px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 36px;
    line-height: 60px;
  }
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const FlexStyle = styled(Flex)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const TextHeaderStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  font-size: 32px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 64px;
  }
`

const ButtonStyle = styled(Button)`
  color: ${baseColors.primary};
  font-size: 12px;
  padding: 0 12px;
  height: 45px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    padding: 0 24px;
    height: 56px;
  }
`

const handleBgDarkMode = (theme) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)

const handleColorDarkMode = (theme) => (theme.isDark ? darkColors.fontPlaceholder : '#8F8FA0')

const ButtonClick = styled(Button)`
  height: 45px;
  font-size: 12px;
  background: ${({ disabled, theme }) => (disabled ? handleBgDarkMode(theme) : baseColors.primary)} !important;
  color: ${({ disabled, theme }) => (disabled ? handleColorDarkMode(theme) : lightColors.invertedContrast)} !important;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    padding: 0 24px;
    height: 56px;
  }
`

const ArrowDownStyle = styled(ArrowDown)`
  margin: 8px;
  stroke: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const PlusStyle = styled(Plus)`
  margin: 8px;
  stroke: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const TextSmall = styled(TextStyle)`
font-size: 12px;
${({ theme }) => theme.mediaQueries.nav} {
  font-size: 16px;
}
`

const TextPrice = styled(TextSmall)`
  position: relative;
  display: inline-block;
  &:hover {
    div {
      visibility: visible;
      opacity: 1;
    }
  }
`

const ToolTipHover = styled.div`
  visibility: hidden;
  background-color: ${({ theme }) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)};
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 100%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 13px;
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)} transparent transparent transparent;
  }
`

export default function RemoveLiquidity({
  history,
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)], [
    currencyA,
    currencyB,
    chainId,
  ])


  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS)
  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')
    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const deadlineForSignature: number = Math.ceil(Date.now() / 1000) + deadline

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'SmartDEX LPs',
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadlineForSignature,
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadlineForSignature,
        })
      })
      .catch((e) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (e?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, val: string) => {
      setSignatureData(null)
      return _onUserInput(field, val)
    },
    [_onUserInput]
  )

  const onLiquidityInput = useCallback((val: string): void => onUserInput(Field.LIQUIDITY, val), [onUserInput])
  const onCurrencyAInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_A, val), [onUserInput])
  const onCurrencyBInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_B, val), [onUserInput])

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH
    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadlineFromNow,
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadlineFromNow,
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }
    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName, index) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((e) => {
            console.error(`estimateGas failed`, index, methodName, args, e)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          })

          setTxHash(response.hash)
        })
        .catch((e: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(e)
        })
    }
  }

  function modalHeader() {
    return (
      <AutoColumn gap="md" style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <TextStyle fontSize="24px">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TextStyle>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size="24px" />
            <TextStyle fontSize="24px" style={{ marginLeft: '10px' }}>
              {currencyA?.symbol}
            </TextStyle>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <PlusStyle size="16" />
        </RowFixed>
        <RowBetween align="flex-end">
          <TextStyle fontSize="24px">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TextStyle>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size="24px" />
            <TextStyle fontSize="24px" style={{ marginLeft: '10px' }}>
              {currencyB?.symbol}
            </TextStyle>
          </RowFixed>
        </RowBetween>

        <TextStyle small color="textSubtle" textAlign="left" padding="12px 0 0 0" style={{ fontStyle: 'italic' }}>
          {`${TranslateString(1227, "Output is estimated. If the price changes by more than")} ${
            allowedSlippage / 100
          }% ${TranslateString(1228, "your transaction will revert.")}`}
        </TextStyle>
      </AutoColumn>
    )
  }

  function modalBottom() {
    const handlePrice = (priceValue) => {
      const priceString = priceValue?.toSignificant(6).toString()
      let priceNew = priceString
      if (priceString && priceString.length > 4) {
        priceNew = `${priceString.slice(0, 4)}...`
      }
  
      return priceNew
    }
    return (
      <>
        <RowBetween>
          <TextSmall color="textSubtle">{`${TranslateString(1233, "FLIP")} ${currencyA?.symbol}/${currencyB?.symbol} ${TranslateString(750, "Burned")}`} </TextSmall>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB}  />
            <TextPrice style={{ paddingLeft:'4px'}}>
            {handlePrice(parsedAmounts[Field.LIQUIDITY]) ?? '-'}
              <ToolTipHover>{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</ToolTipHover>
            </TextPrice>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <TextSmall color="textSubtle">{TranslateString(1182, "Price")}</TextSmall>
              <TextSmall>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </TextSmall>
            </RowBetween>
            <RowBetween>
              <div />
              <TextSmall>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </TextSmall>
            </RowBetween>
          </>
        )}
        <ButtonClick
          disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
          onClick={onRemove}
          style={{
            background: !(approval === ApprovalState.APPROVED || signatureData !== null)
              ? '#E9EAEB'
              : baseColors.primary,
          }}
        >
          Confirm
        </ButtonClick>
      </>
    )
  }

  const pendingText = ` ${TranslateString(12225, "Removing")} ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencyA?.symbol
  }${TranslateString(1230, "and")}${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB)))
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        history.push(`/pool/remove/${currencyId(currency)}/${currencyIdA}`)
      } else {
        history.push(`/pool/remove/${currencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, history]
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        history.push(`/pool/remove/${currencyIdB}/${currencyId(currency)}`)
      } else {
        history.push(`/pool/remove/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, history]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  )

  return (
    <>
      <CardNav activeIndex={1} />
      <AppBody>
        <AddRemoveTabs adding={false} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash || ''}
            content={() => (
              <ConfirmationModalContent
                title={TranslateString(1156, "You will receive")}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="md">
            <Body>
              <OutlineCard>
                <AutoColumn>
                  <RowBetween>
                    <TextStyle>{TranslateString(1231, "Amount")}</TextStyle>
                    <ClickableText
                      onClick={() => {
                        setShowDetailed(!showDetailed)
                      }}
                    >
                      {showDetailed ? TranslateString(1184, "Simple") : TranslateString(1186, "Detailed")}
                    </ClickableText>
                  </RowBetween>
                  <FlexStyle justifyContent="start">
                    <TextHeaderStyle>{formattedAmounts[Field.LIQUIDITY_PERCENT]}%</TextHeaderStyle>
                  </FlexStyle>
                  {!showDetailed && (
                    <>
                      <FlexStyle mb="8px">
                        <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                      </FlexStyle>
                      <FlexStyle justifyContent="space-around">
                        <ButtonStyle
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}
                        >
                          25%
                        </ButtonStyle>
                        <ButtonStyle
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}
                        >
                          50%
                        </ButtonStyle>
                        <ButtonStyle
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}
                        >
                          75%
                        </ButtonStyle>
                        <ButtonStyle
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                        >
                          Max
                        </ButtonStyle>
                      </FlexStyle>
                    </>
                  )}
                </AutoColumn>
              </OutlineCard>
            </Body>
            {!showDetailed && (
              <>
                <ColumnCenter>
                  <ArrowDownStyle size="16" />
                </ColumnCenter>
                <Body>
                  <OutlineCard>
                    <AutoColumn gap="10px">
                      <RowBetween>
                        <TextStyle fontSize="20px">{formattedAmounts[Field.CURRENCY_A] || '-'}</TextStyle>
                        <RowFixed>
                          <CurrencyLogo currency={currencyA} style={{ marginRight: '12px' }} />
                          <TextStyle fontSize="20px" id="remove-liquidity-tokena-symbol">
                            {currencyA?.symbol}
                          </TextStyle>
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <TextStyle fontSize="20px">{formattedAmounts[Field.CURRENCY_B] || '-'}</TextStyle>
                        <RowFixed>
                          <CurrencyLogo currency={currencyB} style={{ marginRight: '12px' }} />
                          <TextStyle fontSize="20px" id="remove-liquidity-tokenb-symbol">
                            {currencyB?.symbol}
                          </TextStyle>
                        </RowFixed>
                      </RowBetween>
                      {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                        <RowBetween style={{ justifyContent: 'flex-end' }}>
                          {oneCurrencyIsETH ? (
                            <StyledInternalLink
                              to={`/pool/remove/${currencyA === ETHER ? WETH[chainId].address : currencyIdA}/${
                                currencyB === ETHER ? WETH[chainId].address : currencyIdB
                              }`}
                            >
                             {TranslateString(1188, "Receive WBNB")}
                            </StyledInternalLink>
                          ) : oneCurrencyIsWETH ? (
                            <StyledInternalLink
                              to={`/pool/remove/${
                                currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'ETH' : currencyIdA
                              }/${currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'ETH' : currencyIdB}`}
                            >
                              {TranslateString(1190, "Receive BNB")}
                            </StyledInternalLink>
                          ) : null}
                        </RowBetween>
                      ) : null}
                    </AutoColumn>
                  </OutlineCard>
                </Body>
              </>
            )}
            <Body style={{ paddingBottom: '24px' }}>
              {showDetailed && (
                <>
                  <CurrencyInputPanel
                    value={formattedAmounts[Field.LIQUIDITY]}
                    onUserInput={onLiquidityInput}
                    onMax={() => {
                      onUserInput(Field.LIQUIDITY_PERCENT, '100')
                    }}
                    showMaxButton={!atMaxAmount}
                    disableCurrencySelect
                    currency={pair?.liquidityToken}
                    pair={pair}
                    id="liquidity-amount"
                  />
                  <ColumnCenter>
                    <ArrowDownStyle size="16" />
                  </ColumnCenter>
                  <CurrencyInputPanel
                    hideBalance
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onUserInput={onCurrencyAInput}
                    onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                    showMaxButton={!atMaxAmount}
                    currency={currencyA}
                    label={TranslateString(1232, "Output")}
                    onCurrencySelect={handleSelectCurrencyA}
                    id="remove-liquidity-tokena"
                  />
                  <ColumnCenter>
                    <PlusStyle size="16" />
                  </ColumnCenter>
                  <CurrencyInputPanel
                    hideBalance
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onUserInput={onCurrencyBInput}
                    onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                    showMaxButton={!atMaxAmount}
                    currency={currencyB}
                    label={TranslateString(1232, "Output")}
                    onCurrencySelect={handleSelectCurrencyB}
                    id="remove-liquidity-tokenb"
                  />
                </>
              )}
              {pair && (
                <div style={{ padding: '24px' }}>
                  <FlexStyle justifyContent="space-between" mb="8px">
                    {TranslateString(1182, "Price")}:
                    <div>
                      1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                    </div>
                  </FlexStyle>
                  <FlexStyle justifyContent="space-between">
                    <div />
                    <div>
                      1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                    </div>
                  </FlexStyle>
                </div>
              )}
              <div style={{ position: 'relative' }}>
                {!account ? (
                  <ConnectWalletButtonStyle
                    endIcon={
                      <BoxIconDirect>
                        <IconDirect src="/images/icon-direct.svg" alt="" />
                      </BoxIconDirect>
                    }
                    style={{ width: '100%' }}
                  />
                ) : (
                  <RowBetween style={{ padding: '20px 8px' }}>
                    <ButtonClick
                      onClick={onAttemptToApprove}
                      variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'success' : '#0085FF'}
                      disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                      mr="8px"
                      style={{
                        width: '48%',
                      }}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <Dots>{TranslateString(204, "Approving")}</Dots>
                      ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                        TranslateString(206, "Approved")
                      ) : (
                        TranslateString(564, "Approve")
                      )}
                    </ButtonClick>
                    <ButtonClick
                      onClick={() => {
                        setShowConfirm(true)
                      }}
                      disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                      variant={
                        !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                          ? 'danger'
                          : 'primary'
                      }
                      style={{
                        width: '48%',
                      }}
                    >
                      {error || TranslateString(260, "Remove")}
                    </ButtonClick>
                  </RowBetween>
                )}
              </div>
              {pair ? (
                <AutoColumn style={{ minWidth: '18rem', marginTop: '1rem' }}>
                  <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                </AutoColumn>
              ) : null}
            </Body>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
