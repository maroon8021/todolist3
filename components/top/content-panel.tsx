import { FC } from "react"
/** @jsx jsx */
import { css, jsx } from "@emotion/core"

const container = css`
  padding: 3rem 0;
  width: 100%;
`

const head = css`
  font-size: 2rem;
  margin-bottom: 1.6rem;
`

const textarea = css`
  min-height: 30rem;
  width: 100%;
  border-radius: 3px;
  padding: 1rem;
`

const ContentPanel = () => {
  return (
    <div css={container}>
      <h3 css={head}>Remaining Tasks</h3>
      <textarea css={textarea} placeholder="Todays todo"></textarea>
    </div>
  )
}

export default ContentPanel
