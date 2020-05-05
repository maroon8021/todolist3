import Link from "next/link"
/** @jsx jsx */
import { css, jsx } from "@emotion/core"

const header = css`
  padding: 0 3rem;
  width: 100%;
  position: fixed;
  border-bottom: 1px solid #eee;
  top: 0;
  background-color: #fff;
`

const inner = css`
  max-width: 100rem;
  margin: 0 auto;
`

const link = css`
  color: #333;
  cursor: pointer;
`

const head = css`
  font-size: 30px;
  margin: 2rem 0;
  display: inline-block;
`

const Header = () => {
  return (
    <header css={header}>
      <div css={inner}>
        <Link href="/">
          <a css={link}>
            <h1 css={head}>TodoList</h1>
          </a>
        </Link>
      </div>
    </header>
  )
}

export default Header
