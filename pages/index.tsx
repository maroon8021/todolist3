import Head from "next/head"
import Header from "c/common/header"
import Main from "c/top/main"
import { Provider } from "c/top/context"
/** @jsx jsx */
import { css, jsx, Global } from "@emotion/core"
import { Alert } from "c/top/alert"

const pageGlobal = css`
  body {
    overflow-y: hidden;
  }
`

export default function Home() {
  return (
    <Provider>
      <Global styles={pageGlobal} />
      <Header />
      <Head>
        <title>TodoList3</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>
      <Main />
    </Provider>
  )
}
