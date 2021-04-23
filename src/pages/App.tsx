import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
// import { Credentials, StringTranslations } from '@crowdin/crowdin-api-client'
import Web3ReactManager from '../components/Web3ReactManager'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import AddLiquidity from './AddLiquidity'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import Swap from './Swap'
import { RedirectPathToSwapOnly } from './Swap/redirects'
import { EN, allLanguages } from '../constants/localisation/languageCodes'
import { LanguageContext } from '../hooks/LanguageContext'
import { TranslationsContext } from '../hooks/TranslationsContext'
import Menu from '../components/Menu'
import { darkColors, lightColors } from '../style/Color'
import Popups from '../components/Popups'
import { listLanguage } from '../locales/index'
import ToastListener from '../components/ToastListener'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  justify-content: center;
  background-size: 100%;
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundContent : lightColors.backgroundContent)};
  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    min-height: 90vh;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`
const BlockPopup = styled.div`
  position: absolute;
  width: 20%;
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundContent : lightColors.backgroundContent)};
  padding-top: 12px;
  right: 0;
  top: 0;
`
export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])
  // const apiKey = `${process.env.REACT_APP_CROWDIN_APIKEY}`
  // const projectId = parseInt(`${process.env.REACT_APP_CROWDIN_PROJECTID}`)
  // const fileId = 6

  // const credentials: Credentials = {
  //   token: apiKey,
  // }

  // const stringTranslationsApi = new StringTranslations(credentials)

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem('pancakeSwapLanguage')
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      const data = JSON.parse(localStorage.getItem("lang") || '{}').code ? JSON.parse(localStorage.getItem("lang") || '{}') : EN
      setSelectedLanguage(data)
    }
  }, [])

  // const fetchTranslationsForSelectedLanguage = async () => {
  //   stringTranslationsApi
  //     .listLanguageTranslations(projectId, selectedLanguage.code, undefined, fileId, 200)
  //     .then((translationApiResponse) => {
  //       if (translationApiResponse.data.length < 1) {
  //         setTranslations(['error'])
  //       } else {
  //         setTranslations(translationApiResponse.data)
  //       }
  //     })
  //     .then(() => setTranslatedLanguage(selectedLanguage))
  //     .catch((error) => {
  //       setTranslations(['error'])
  //       console.error(error)
  //     })
  // }

  useEffect(() => {
    let translationData
    if (selectedLanguage) {
      localStorage.setItem('lang', JSON.stringify(selectedLanguage))
      listLanguage.map((item)=>{
        if (item.language === selectedLanguage.code){
          translationData = item.data
        }
        return setTranslations(translationData)
      })   
    }
  }, [selectedLanguage, setTranslations])

  return (
    <Suspense fallback={null}>
      <HashRouter>
        <AppWrapper>
        <ToastListener />
          <LanguageContext.Provider
            value={{ selectedLanguage, setSelectedLanguage, translatedLanguage, setTranslatedLanguage }}
          >
            <TranslationsContext.Provider value={{ translations, setTranslations }}>
              <Menu>
             
                <BlockPopup>
                  <Popups />
                </BlockPopup>
                <BodyWrapper>
                  <Web3ReactManager>
                    <Switch>
                      <Route exact strict path="/swap" component={Swap} />
                      <Route exact strict path="/find" component={PoolFinder} />
                      <Route exact strict path="/pool" component={Pool} />
                      <Route exact strict path="/pool/add" component={AddLiquidity} />
                      <Route exact strict path="/pool/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

                      {/* Redirection: These old routes are still used in the code base */}
                      <Route exact path="/pool/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                      <Route exact path="/pool/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                      <Route exact strict path="/pool/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />

                      <Route component={RedirectPathToSwapOnly} />
                    </Switch>
                  </Web3ReactManager>
                  <Marginer />
                </BodyWrapper>
              </Menu>
            </TranslationsContext.Provider>
          </LanguageContext.Provider>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
