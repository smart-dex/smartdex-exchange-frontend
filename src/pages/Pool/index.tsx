import React, { useMemo } from 'react'
import { lightColors, baseColors, darkColors } from 'style/Color'
import styled from 'styled-components'
import { Pair } from '@sotatek-anhdao/cake-sdk'
import { Button, CardBody, Text } from 'uikit-sotatek'
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

  const ButtonStyle = styled.div`
  margin-top: 45px;
  a {
  background: ${({ theme }) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)};
  color: ${baseColors.primary};
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(239, 239, 239, 0.24);
  height: 45px;
  font-weight: 600;
  font-size: 13px;
  position: relative;
  padding-right: 24px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    height: 56px;
    padding-right: 36px;
  }
  
`

  const TextHeading = styled(Text)`
    font-size: 14px;
    line-height: 17px;
    font-weight: 600;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
      line-height: 20px;
    }
  `

  const TextStyle = styled(Text)`
    font-size: 10px;
    line-height: 20px;
    padding: 0;
    font-weight: 500;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 14px;
      line-height: 24px;
      padding: 0.2rem 0;
    }
  `
  const TextContent = styled(Text)`
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
    color: ${({ theme }) => (theme.isDark ? darkColors.titleMini : lightColors.titleSub)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 14px;
      line-height: 17px;
    }
  `

  const TextLink = styled.a`
    a {
      color: ${baseColors.primary};
      font-weight: 600;
      font-size: 10px;
      line-height: 12px;
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      a {
        font-size: 14px;
        line-height: 17px;
      }
    }
  `

  const StyleConnect = styled.div`
    div {
      background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
      border: none;
    }
  `

  const BodyStyle = styled.div`
    background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
    border: 1px solid ${({ theme }) => (theme.isDark ? darkColors.borderColor : lightColors.borderColor)};
    box-shadow: 14px 14px 20px rgba(120, 118, 148, 0.1);
    border-radius: 30px;
    width: 334px;
    ${({ theme }) => theme.mediaQueries.nav} {
      width: 530px;
      border-left: 20px solid ${baseColors.primary};
      border-radius: 10px;
    }
  `

  const ArrowLeft = styled.div`
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
      margin-left: 42px;
      border-top: 15px solid transparent;
      border-bottom: 15px solid transparent;
      border-right: 25px solid ${baseColors.primary};
    }
  `

  const CardBodyStyle = styled(CardBody)`
    padding: 23px 24px 37px 24px;
    ${({ theme }) => theme.mediaQueries.nav} {
      padding: 30px 34px 28px 49px;
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
  return (
    <>
      <CardNav activeIndex={1} />
      <ArrowLeft />
      <BodyStyle>
        <PageHeader title="Liquidity" description="Add liquidity to receive LP tokens" />
        <AutoColumn gap="lg">
          <CardBodyStyle>
            <AutoColumn style={{ width: '100%' }}>
              <RowBetween>
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
                  <LightCard padding="50px 20px">
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
                <TextStyle fontSize="14px" style={{ padding: '0.18rem 0 .5rem 0' }}>
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

            <ButtonStyle>
              <Button id="join-pool-button" as={Link} to="/add/ETH">
                {TranslateString(100, 'Add Liquidity')}
                <BoxIconDirect>
                  <IconDirect src="/images/icon-direct.svg" alt="" />
                </BoxIconDirect>
              </Button>
            </ButtonStyle>
          </CardBodyStyle>
        </AutoColumn>
      </BodyStyle>
    </>
  )
}
