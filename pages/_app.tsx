import { FC } from "react"
import { AppProps } from "next/app"
import Head from "next/head"
import { Global, css } from "@emotion/core"
import { CookiesProvider } from "react-cookie"
import reset from "../assets/styles/reset"

const font = css`
  html,
  body {
    font-family: Ubuntu, "Noto Sans JP,Noto Sans Japanese,Noto Sans,sans-serif";
  }
`

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <CookiesProvider>
        <Global
          styles={css`
            ${reset}
            ${font}
          `}
        />
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans+JP"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@500&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
      </CookiesProvider>
    </>
  )
}

export default MyApp
