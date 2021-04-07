import React, { useCallback, useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import styled from 'styled-components'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@sotatek-anhdao/smartdex-sdk'
import { darkColors, lightColors, baseColors } from 'style/Color'
import { Button, CardBody, AddIcon, Text as UIKitText } from 'uikit-sotatek'
import { RouteComponentProps } from 'react-router-dom'
import { LightCard } from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import CardNav from 'components/CardNav'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { AddRemoveTabs } from 'components/NavigationTabs'
import { MinimalPositionCard } from 'components/PositionCard'
import Row, { RowBetween, RowFlat } from 'components/Row'

import { PairState } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'

import { useTransactionAdder } from 'state/transactions/hooks'
import { useIsExpertMode, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { currencyId } from 'utils/currencyId'
import Pane from 'components/Pane'
import ConnectWalletButton from 'components/ConnectWalletButton'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { PoolPriceBar } from './PoolPriceBar'
import { ROUTER_ADDRESS } from '../../constants'

const ConnectWalletButtonStyle = styled(ConnectWalletButton)`
  margin-top: 16px;
`
export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )
  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [deadline] = useUserDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadlineFromNow,
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadlineFromNow,
      ]
      value = null
    }

    setAttemptingTxn(true)
    // const aa = await estimate(...args, value ? { value } : {})
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          })

          setTxHash(response.hash)
        })
      )
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
        }
      })
  }

  const StyleText = styled(UIKitText)`
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
    color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
    }
  `

  const StyleTextTit = styled(UIKitText)`
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    text-transform: uppercase;
    padding-bottom: 8px;
    color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 14px;
    }
  `

  const AutoColumnStyle = styled(AutoColumn)`
    margin-top: 12px;
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

  const UIKitTextStyle = styled(UIKitText)`
    color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
   
  `

  const UIKitTextCurrent = styled(UIKitText)`
    color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
    font-size: 28px;
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 48px;
    }
  `

  const StyleIcon = styled(UIKitText)`
    svg {
      width: 12px;
      path {
        fill: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
      }
    }
  `

  const handleBgDarkMode = (theme) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)

  const handleColorDarkMode = (theme) => (theme.isDark ? darkColors.fontPlaceholder : '#8F8FA0')

  const ButtonStyle = styled(Button)`
    background: ${({ disabled, theme }) => (disabled ? handleBgDarkMode(theme) : baseColors.primary)} !important;
    color: ${({ disabled, theme }) =>
      disabled ? handleColorDarkMode(theme) : lightColors.invertedContrast} !important;
    font-size: 12px;
    padding: 0 12px;
    height: 45px;
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
      padding: 0 24px;
      height: 56px;
    }
  `
  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <UIKitTextCurrent mr="8px">
              {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
            </UIKitTextCurrent>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="20px">
        <RowFlat style={{ marginTop: '20px' }}>
          <UIKitTextCurrent mr="8px">
            {liquidityMinted?.toSignificant(6)}
          </UIKitTextCurrent>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </RowFlat>
        <Row>
          <UIKitTextStyle fontSize="24px">
            {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}
          </UIKitTextStyle>
        </Row>
        <UIKitTextStyle small textAlign="left" padding="8px 0 0 0 " style={{ fontStyle: 'italic' }}>
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </UIKitTextStyle>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleCurrencyASelect = useCallback(
    (currA: Currency) => {
      const newCurrencyIdA = currencyId(currA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currB: Currency) => {
      const newCurrencyIdB = currencyId(currB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA || 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const formattedAmountsB = formattedAmounts[Field.CURRENCY_B];
  const formattedAmountsA = formattedAmounts[Field.CURRENCY_A];
  const [valueDefaultA, setValueDefaultA ] = useState(formattedAmountsB)
  const [valueDefaultB, setValueDefaultB ] = useState(formattedAmountsA)

  useEffect(() => {
    setValueDefaultA(formattedAmountsA)
  }, [formattedAmountsA])

  useEffect(() => {
    setValueDefaultB(formattedAmountsB)
  }, [formattedAmountsB])

  useEffect(() => {
    setValueDefaultA('');
    setValueDefaultB('');
  }, [])

  
  return (
    <>
      <CardNav activeIndex={1} />
      <AppBody>
        <AddRemoveTabs adding />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <CardBody>
            <AutoColumn gap="20px">
              {noLiquidity && (
                <ColumnCenter>
                  <Pane>
                    <AutoColumn gap="12px">
                      <UIKitText>
                        <StyleText>You are the first liquidity provider.</StyleText>
                      </UIKitText>
                      <UIKitText>
                        <StyleText>The ratio of tokens you add will set the price of this pool.</StyleText>
                      </UIKitText>
                      <UIKitText>
                        <StyleText>Once you are happy with the rate click supply to review.</StyleText>
                      </UIKitText>
                    </AutoColumn>
                  </Pane>
                </ColumnCenter>
              )}
              <CurrencyInputPanel
                value={valueDefaultA}
                onUserInput={(value: string) => {setValueDefaultA(value); onFieldAInput(value)}}
                onMax={() => {
                  setValueDefaultA(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                }}
                onCurrencySelect={handleCurrencyASelect}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases={false}
              />
              <ColumnCenter>
                <StyleIcon>
                  <AddIcon />
                </StyleIcon>
              </ColumnCenter>
              <CurrencyInputPanel
                value={valueDefaultA ==='' ? '' : valueDefaultB}
                onUserInput={(value: string) => { setValueDefaultB(value); onFieldBInput(value)}}
                onCurrencySelect={handleCurrencyBSelect}
                onMax={() => {
                  setValueDefaultB(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases={false}
              />
              {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                <div>
                  <StyleTextTit>{noLiquidity ? 'Initial prices and pool share' : 'Prices and pool share'}</StyleTextTit>
                  <Pane>
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={poolTokenPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </Pane>
                </div>
              )}

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
                <AutoColumnStyle gap="md">
                  {(approvalA === ApprovalState.NOT_APPROVED ||
                    approvalA === ApprovalState.PENDING ||
                    approvalB === ApprovalState.NOT_APPROVED ||
                    approvalB === ApprovalState.PENDING) &&
                    isValid && (
                      <RowBetween>
                        {approvalA !== ApprovalState.APPROVED && (
                          <ButtonStyle
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            style={{ width: approvalB !== ApprovalState.APPROVED ? '48%' : '100%' }}
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                            ) : (
                              `Approve ${currencies[Field.CURRENCY_A]?.symbol}`
                            )}
                          </ButtonStyle>
                        )}
                        {approvalB !== ApprovalState.APPROVED && (
                          <ButtonStyle
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            style={{ width: approvalA !== ApprovalState.APPROVED ? '48%' : '100%' }}
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                            ) : (
                              `Approve ${currencies[Field.CURRENCY_B]?.symbol}`
                            )}
                          </ButtonStyle>
                        )}
                      </RowBetween>
                    )}
                  <ButtonStyle
                    onClick={() => {
                      if (expertMode) {
                        onAdd()
                      } else {
                        setShowConfirm(true)
                      }
                    }}
                    disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                    variant={
                      !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                        ? 'danger'
                        : 'primary'
                    }
                  >
                    {error ?? 'Supply'}
                  </ButtonStyle>
                </AutoColumnStyle>
              )}
            </AutoColumn>
            {pair && !noLiquidity && pairState !== PairState.INVALID ? (
              <AutoColumn style={{ minWidth: '18rem', marginTop: '1rem' }}>
                <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
              </AutoColumn>
            ) : null}
          </CardBody>
        </Wrapper>
      </AppBody>
    </>
  )
}
