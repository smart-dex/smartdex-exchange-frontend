import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@pancakeswap-libs/sdk'
import { Button, CardBody, Text } from '@pancakeswap-libs/uikit'
import { Link } from 'react-router-dom'
import CardNav from 'components/CardNav'
import Question from 'components/QuestionHelper'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { LightCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'

import { useActiveWeb3React } from 'hooks'
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Dots } from 'components/swap/styleds'
import TranslatedText from 'components/TranslatedText'
import { TranslateString } from 'utils/translateTextHelpers'
import PageHeader from 'components/PageHeader'
import { lightColors, baseColors, darkColors } from 'style/Color'
import AppBody from '../AppBody'
import {ButtonSecondary} from '../../style/Button'

export default function Pool() {
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens,
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const ButtonAdd = styled(Button)`
    ${ButtonSecondary}
    padding: 0 20px;
    font-weight: 600;
    @media(max-width: 767px) {
      font-size: 14px;
      line-height: 17px;
    }
  `

  const TextHeading = styled(Text)`
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
    @media(max-width: 767px) {
      font-size: 14px;
      line-height: 17px;
    }
  `

  const TextStyle = styled(Text)`
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    padding: .5rem 0 .5rem 0;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
    @media(max-width: 767px) {
      font-size: 10px;
      line-height: 20px;
      padding: 0;
    }
  `
  const TextContent = styled(Text)`
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: ${({ theme }) => (theme.isDark ? darkColors.titleMini : "rgba(95, 94, 118, 0.5)")};
    @media(max-width: 767px) {
      font-size: 10px;
      line-height: 12px;
    }
  `

  const TextLink = styled.a `
    .sc-jQbIHB {
      color: ${baseColors.primary};
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
    }
    @media(max-width: 767px) {
      .sc-jQbIHB {
        font-size: 10px;
        line-height: 12px;
      }
    }
  `

  const StyleConnect = styled.div`
  .sc-dtTInj.sc-dkIXFM.dKXeuF.fDZHaJ {
    background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
    border: none;
  }
  `

  return (
    <>
      <CardNav activeIndex={1} />
      <AppBody>
        <PageHeader title="Liquidity" description="Add liquidity to receive LP tokens">
          <ButtonAdd id="join-pool-button" as={Link} to="/add/ETH">
            <TranslatedText translationId={100}>Add Liquidity</TranslatedText>
          </ButtonAdd>
        </PageHeader>
        <AutoColumn gap="lg" justify="center">
          <CardBody>
            <AutoColumn gap="12px" style={{ width: '100%' }}>
              <RowBetween padding="0 8px">
                <TextHeading>
                  <TranslatedText translationId={102}>Your Liquidity</TranslatedText>
                </TextHeading>
                <Question
                  text={TranslateString(
                    130,
                    'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                  )}
                />
              </RowBetween>

              {!account ? (
                <StyleConnect>
                  <LightCard padding="40px 20px">
                      <TextContent color="textDisabled" textAlign="center">
                        Connect to a wallet to view your liquidity.
                      </TextContent>
                  </LightCard>
                </StyleConnect>
              ) : v2IsLoading ? (
                <LightCard padding="20px">
                  <Text color="textDisabled" textAlign="center">
                    <Dots>Loading</Dots>
                  </Text>
                </LightCard>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                </>
              ) : (
                <LightCard padding="40px 20px">
                  <Text color="textDisabled" textAlign="center">
                    <TranslatedText translationId={104}>No liquidity found.</TranslatedText>
                  </Text>
                </LightCard>
              )}

              <div>
                <TextStyle fontSize="14px" style={{ padding: '.5rem 0 .5rem 0' }}>
                  {TranslateString(106, "Don't see a pool you joined?")}&nbsp;&nbsp;&nbsp;&nbsp;
                  <TextLink>
                    <StyledInternalLink color="red" id="import-pool-link" to="/find">
                      {TranslateString(108, 'Import it.')}
                    </StyledInternalLink>
                  </TextLink>
                </TextStyle>
                <TextStyle fontSize="14px">
                  Or, if you staked your FLIP tokens in a farm, unstake them to see them here.
                </TextStyle>
              </div>
            </AutoColumn>
          </CardBody>
        </AutoColumn>
      </AppBody>
    </>
  )
}
