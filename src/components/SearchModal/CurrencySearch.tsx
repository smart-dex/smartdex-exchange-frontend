import { Currency, ETHER, Token } from '@sotatek-anhdao/smartdex-sdk'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Text } from 'uikit-sotatek'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'
import { lightColors, darkColors, baseColors } from 'style/Color'
import { useActiveWeb3React } from '../../hooks'
import { AppState } from '../../state'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { LinkStyledButton } from '../Shared'
import { isAddress } from '../../utils'
import Card from '../Card'
import Column from '../Column'
import ListLogo from '../ListLogo'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween } from '../Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens } from './filtering'
import SortButton from './SortButton'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInputToken } from './styleds'
import TranslatedText from '../TranslatedText'
import { TranslateString } from '../../utils/translateTextHelpers'

const StyleHeader = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)};
  display: flex;
`

const HeadingTitle = styled(Text)`
  font-size: 18px;
  line-height: 22px;
  font-weight: bold;
  color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 24px;
    line-height: 29px;
  }
`

const IconClose = styled(Text)`
 cursor: pointer;
  width: 20px;
  height: 20px;
  svg path {
    fill: ${({ theme }) => (theme.isDark ? darkColors.iconClose : lightColors.iconClose)};
  }
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 29px;
    height: 29px;
  }
`

const TopDevider = styled(Text)`
line-height: 0.5;
  svg rect {
    stroke: ${({ theme }) => (theme.isDark ? darkColors.borderTop : lightColors.borderTop)};
  }
`

const SubTitle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.contrast : lightColors.titleMini)};
  font-weight: 600;
  font-size: 13px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
  }
`

const StyleLink = styled(Text)`
  button {
    color: ${baseColors.primary};
    font-weight: 600;
    font-size: 13px;
  }
  ${({ theme }) => theme.mediaQueries.nav} {
    button {
      font-size: 16px;
    }
  }
`

const StyleText = styled(Text)`
  div {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
    }
  }
`

const StyleIcon = styled(Text)`
  svg {
    margin-top: 10px;
  }
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  onChangeList: () => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  onChangeList,
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [searchQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const audioPlay = useSelector<AppState, AppState['user']['audioPlay']>((state) => state.user.audioPlay)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((token) => token.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
      if (audioPlay) {
        const audio = document.getElementById('bgMusic') as HTMLAudioElement
        if (audio) {
          audio.play()
        }
      }
    },
    [onDismiss, onCurrencySelect, audioPlay]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )

  const selectedListInfo = useSelectedListInfo()

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <StyleHeader>
            <HeadingTitle><TranslatedText translationId={82}>Select a token</TranslatedText></HeadingTitle>
            <QuestionHelper
              text={TranslateString(
                130,
                'Find a token by searching for its name or symbol or by pasting its address below.'
              )}
            />
          </StyleHeader>
          <IconClose onClick={onDismiss}>
            <svg viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 0.916626C7.43538 0.916626 0.916626 7.43538 0.916626 15.5C0.916626 23.5645 7.43538 30.0833 15.5 30.0833C23.5645 30.0833 30.0833 23.5645 30.0833 15.5C30.0833 7.43538 23.5645 0.916626 15.5 0.916626ZM22.7916 20.7354L20.7354 22.7916L15.5 17.5562L10.2645 22.7916L8.20829 20.7354L13.4437 15.5L8.20829 10.2645L10.2645 8.20829L15.5 13.4437L20.7354 8.20829L22.7916 10.2645L17.5562 15.5L22.7916 20.7354Z"/>
            </svg>
          </IconClose>
        </RowBetween>

        <TopDevider>
          <svg viewBox="0 0 413 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="411" height="1" strokeDasharray="5 5"/>
          </svg>
        </TopDevider>

        <SearchInputToken
          type="text"
          id="token-search-input"
          placeholder={t('tokenSearchPlaceholder')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
        <RowBetween>
          <SubTitle>
            <TranslatedText translationId={126}>Token name</TranslatedText>
          </SubTitle>
            <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder((iso) => !iso)} />
        </RowBetween>
      </PaddedColumn>

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              showETH={showETH}
              currencies={filteredSortedTokens}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>

      {null && (
        <>
          <Card>
            <RowBetween>
              {selectedListInfo.current ? (
                <Row>
                  {selectedListInfo.current.logoURI ? (
                    <StyleIcon >
                      <ListLogo
                        style={{ marginRight: 12 }}
                        logoURI={selectedListInfo.current.logoURI}
                        alt={`${selectedListInfo.current.name} list logo`}
                      />
                    </StyleIcon>
                  ) : null}
                  <StyleText><Text id="currency-search-selected-list-name">{selectedListInfo.current.name}</Text></StyleText>
                </Row>
              ) : null}
              <StyleLink>
                <LinkStyledButton
                  onClick={onChangeList}
                  id="currency-search-change-list-button"
                >
                  {selectedListInfo.current ? 'Change' : 'Select a list'}
                </LinkStyledButton>
              </StyleLink>
            </RowBetween>
          </Card>
        </>
      )}
    </Column>
  )
}

export default CurrencySearch
