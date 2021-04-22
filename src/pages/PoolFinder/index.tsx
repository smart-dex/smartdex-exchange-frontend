import { Currency, ETHER, JSBI, TokenAmount } from '@sotatek-anhdao/smartdex-sdk'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { baseColors, darkColors, lightColors } from 'style/Color'
import { Button, ChevronDownIcon, AddIcon, CardBody, Text } from 'uikit-sotatek'
import CardNav from 'components/CardNav'
import { LightCard } from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { FindPoolTabs } from 'components/NavigationTabs'
import { MinimalPositionCard } from 'components/PositionCard'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { usePairAdder } from 'state/user/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { currencyId } from 'utils/currencyId'
import TranslatedText from 'components/TranslatedText'
import { TranslateString } from 'utils/translateTextHelpers'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export default function PoolFinder() {
  const { account } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const TextNote = styled(Text)`
  div {
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
    color: ${({ theme }) => (theme.isDark ? darkColors.titleMini : lightColors.titleSub)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 14px;
      line-height: 17px;
    }
  }
  `

  const StyleNote = styled(Text)`
  div {
    background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
    border: none;
  }
  `

  const prerequisiteMessage = (
    <StyleNote>
      <LightCard padding="45px 10px">
        <TextNote>
          <Text style={{ textAlign: 'center' }}>
            {!account ? 'Connect to a wallet to find pools' : TranslateString(208, "Select a token to find your liquidity.")}
          </Text>
        </TextNote>
      </LightCard>
    </StyleNote>
  )

  const StyleButton = styled(Text)`
    button {
      width: 100%;
      height: 45px;
      font-size: 13px;
      background: ${baseColors.primary};
      ${({ theme }) => theme.mediaQueries.nav} {
        font-size: 16px;
      }
    }
  `

  const StyleIcon = styled(Text)`
    svg {
      width: 12px;
      path {
        fill: ${({ theme }) => (theme.isDark ? darkColors.colorIcon : lightColors.colorIcon )};
      }
    }
  `
  const StyleText = styled(Text)`
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
    color: ${({theme}) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
    }
  `

  const StyleLink = styled(Text)`
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
    color: ${baseColors.primary};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
    }
  `

  return (
    <>
      <CardNav activeIndex={1} />
      <AppBody>
        <FindPoolTabs />
        <CardBody>
          <AutoColumn gap="md">
            <StyleButton>
              <Button
                onClick={() => {
                  setShowSearch(true)
                  setActiveField(Fields.TOKEN0)
                }}
                startIcon={currency0 ? <CurrencyLogo currency={currency0} style={{ marginRight: '.5rem', stroke:'#fff' }} /> : null}
                endIcon={<ChevronDownIcon width="24px" color="white" />}
              >
                {currency0 ? currency0.symbol : <TranslatedText translationId={82}>Select a Token</TranslatedText>}
              </Button>
            </StyleButton>

            <ColumnCenter style={{padding: '0px'}}>
              <StyleIcon><AddIcon color="textSubtle" /></StyleIcon>
            </ColumnCenter>

            <StyleButton>
              <Button
                onClick={() => {
                  setShowSearch(true)
                  setActiveField(Fields.TOKEN1)
                }}
                startIcon={currency1 ? <CurrencyLogo currency={currency1} style={{ marginRight: '.5rem', stroke:'#fff' }} /> : null}
                endIcon={<ChevronDownIcon width="24px" color="white" />}
              >
                {currency1 ? currency1.symbol : <TranslatedText translationId={82}>Select a Token</TranslatedText>}
              </Button>
            </StyleButton>

            {hasPosition && (
              <ColumnCenter
                style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
              >
                <StyleText style={{ textAlign: 'center' }}>{TranslateString(210, 'Pool Found!')}</StyleText>
              </ColumnCenter>
            )}

            {currency0 && currency1 ? (
              pairState === PairState.EXISTS ? (
                hasPosition && pair ? (
                  <MinimalPositionCard pair={pair} />
                ) : (
                  <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text style={{ textAlign: 'center' }}><StyleText>{ TranslateString(1176, "You don’t have liquidity in this pool yet.")}</StyleText></Text>
                      <StyledInternalLink to={`/pool/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                        <StyleLink style={{ textAlign: 'center' }}>
                           {TranslateString(168, 'Add Liquidity')}
                        </StyleLink>
                      </StyledInternalLink>
                    </AutoColumn>
                  </LightCard>
                )
              ) : validPairNoLiquidity ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <StyleText style={{ textAlign: 'center' }}><StyleText>{TranslateString(214, "No pool found")}.</StyleText></StyleText>
                    <StyledInternalLink style={{color: baseColors.primary}} to={`/pool/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      <StyleLink>{TranslateString(216, "Create pool.")}</StyleLink>
                    </StyledInternalLink>
                  </AutoColumn>
                </LightCard>
              ) : pairState === PairState.INVALID ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      <StyleText>{TranslateString(136, 'Invalid pair')}</StyleText>
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : pairState === PairState.LOADING ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      <StyleText>{TranslateString(218, 'Loading')}</StyleText>
                      <Dots />
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : null
            ) : (
              prerequisiteMessage
            )}
          </AutoColumn>

          <CurrencySearchModal
            isOpen={showSearch}
            onCurrencySelect={handleCurrencySelect}
            onDismiss={handleSearchDismiss}
            showCommonBases
            selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
          />
        </CardBody>
      </AppBody>
    </>
  )
}
