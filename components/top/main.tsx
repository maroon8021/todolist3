/* eslint-disable @typescript-eslint/camelcase */
import { useEffect, useContext } from "react"
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import axios from "axios"
/** @jsx jsx */
import { css, jsx } from "@emotion/core"

import { Store } from "c/top/context"
import { setUserInfo } from "c/top/reducer"
import TodoTextarea from "c/top/todo-textarea"
import TimeList from "c/top/time-list"
import ContentPanel from "c/top/content-panel"

const COOKIE_LOGIN = "login"
const COOKIE_ACCESS_TOKEN = "access_token"

const AUTH_URL = `${process.env.AUTH_URL}`
const AUTH_URL_WITH_PROTOCOL = `https:${AUTH_URL}`
const PARAMS = {
  client_id: `${process.env.CLIENT_ID}`,
  client_secret: `${process.env.CLIENT_SECRET}`,
  response_type: "code",
  scope: "openid",
  redirect_uri:
    `${process.env.NODE_ENV}` === "development"
      ? "https://localhost:3000"
      : `${process.env.REDIRECT_URL}`,
  grant_type: "authorization_code",
}

const container = css`
  max-width: 100rem;
  margin: 0 auto;
  margin-top: 7rem;
  display: flex;
`

const leftArea = css`
  width: 80%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  height: 85vh;
  padding-right: 2rem;
`

const leftAreaShown = css`
  ${leftArea}
  width: 50%;
`

const rightArea = css`
  width: 50%;
  padding-left: 2rem;
`

export default function Main() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIE_LOGIN,
    COOKIE_ACCESS_TOKEN,
  ])

  useEffect(() => {
    async function fetchLogin(): Promise<void> {
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
        const userName = userInfo.data.username
        const userId = userInfo.data.sub
        isLogined = true
        dispatch(setUserInfo({ userName, userId }))
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
        const userName = userInfo.data.username
        const userId = userInfo.data.sub
        isLogined = true
        dispatch(setUserInfo({ userName, userId }))
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
    <main css={container}>
      <div css={state.contentPanel.isShown ? leftAreaShown : leftArea}>
        <TodoTextarea />
        <TimeList />
      </div>
      {state.contentPanel.isShown ? (
        <>
          <div css={rightArea}>
            <ContentPanel />
          </div>
        </>
      ) : (
        <></>
      )}
    </main>
  )
}
