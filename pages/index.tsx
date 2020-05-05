/* eslint-disable @typescript-eslint/camelcase */
import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import axios from "axios"
import Header from "c/common/header"
import TodoTextarea from "c/top/todo-textarea"
import TimeList from "c/top/time-list"
import ContentPanel from "c/top/content-panel"
/** @jsx jsx */
import { css, jsx, Global } from "@emotion/core"
const COOKIE_LOGIN = "login"
const COOKIE_ACCESS_TOKEN = "access_token"

const AUTH_URL = "//todolist3.auth.ap-northeast-1.amazoncognito.com/"
const AUTH_URL_WITH_PROTOCOL =
  "https://todolist3.auth.ap-northeast-1.amazoncognito.com/"
const PARAMS = {
  client_id: "7f8mcmf0cri6llnvnfp3b4umhr",
  client_secret: "mcd5ph1nnq1ifodlc2vu45looi1qj9nurmscv481e5ov5kl6q8p",
  response_type: "code",
  scope: "email+openid",
  redirect_uri: "https://localhost:3000",
  grant_type: "authorization_code",
}

const pageGlobal = css`
  body {
    overflow-y: hidden;
  }
`

const container = css`
  max-width: 100rem;
  margin: 0 auto;
  margin-top: 7rem;
  display: flex;
`

const leftArea = css`
  width: 50%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 85vh;
  padding-right: 2rem;
`

const rightArea = css`
  width: 50%;
  padding-left: 2rem;
`

export default function Home() {
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIE_LOGIN,
    COOKIE_ACCESS_TOKEN,
  ])
  const [currentUserInfo, setUserInfo] = useState({})
  useEffect(() => {
    async function fetchLogin() {
      let isLogined = false
      const access_token = cookies[COOKIE_ACCESS_TOKEN]
      try {
        const bearer = `Bearer ${access_token}`
        const userInfo: any = await axios.post(
          `${AUTH_URL_WITH_PROTOCOL}oauth2/userInfo`,
          {},
          {
            headers: {
              authorization: bearer,
            },
          }
        )
        setUserInfo(userInfo.data)
        isLogined = true
      } catch (error) {
        //console.log(error)
      }

      const code = router.query.code as string
      if ((!code && router.asPath !== "/") || isLogined) {
        return
      }
      const {
        client_id,
        client_secret,
        response_type,
        scope,
        redirect_uri,
      } = PARAMS

      const params = new URLSearchParams()
      Object.keys(PARAMS).forEach((key) => {
        params.append(key, PARAMS[key])
      })
      params.append("code", code) //loginToken
      const authorize = "Basic " + btoa(`${client_id}:${client_secret}`)
      const options = {
        headers: {
          authorization: authorize,
        },
      }
      try {
        const tokenData: any = await axios.post(
          `${AUTH_URL_WITH_PROTOCOL}oauth2/token`,
          params,
          options
        )
        const { access_token } = tokenData.data
        setCookie(COOKIE_ACCESS_TOKEN, access_token)
        const bearer = `Bearer ${access_token}`
        const userInfo: any = await axios.post(
          `${AUTH_URL_WITH_PROTOCOL}oauth2/userInfo`,
          {},
          {
            headers: {
              authorization: bearer,
            },
          }
        )
        setUserInfo(userInfo.data)
      } catch (error) {
        //console.log(error)
        router.push(
          `${AUTH_URL}login?client_id=${client_id}&response_type=${response_type}&scope=${scope}&redirect_uri=${redirect_uri}`
        )
      }
    }
    fetchLogin()
  }, [router]) // to get 'query'
  return (
    <>
      <Global styles={pageGlobal} />
      <Header />
      <Head>
        <title>TodoList3</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main css={container}>
        <div css={leftArea}>
          <TodoTextarea />
          <TimeList />
        </div>
        <div css={rightArea}>
          <ContentPanel />
        </div>
      </main>
    </>
  )
}
