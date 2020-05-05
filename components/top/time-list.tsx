import { FC } from "react"
/** @jsx jsx */
import { css, jsx } from "@emotion/core"

type TimeListType = string

const TimeLists: TimeListType[] = [
  "10:00 ~ 11:00",
  "11:00 ~ 12:00",
  "12:00 ~ 13:00",
  "13:00 ~ 14:00",
  "14:00 ~ 15:00",
  "15:00 ~ 16:00",
  "16:00 ~ 17:00",
  "17:00 ~ 18:00",
  "18:00 ~ 19:00",
  "19:00 ~ 20:00",
]

const container = css`
  padding: 3rem 0;
  width: 100%;
`

const head = css`
  font-size: 2rem;
  margin-bottom: 1.6rem;
`

const lists = css``

const TimeList = () => {
  return (
    <div css={container}>
      <h3 css={head}>TimeList</h3>
      <div css={lists}>
        {TimeLists.map((time) => (
          <TimeRow time={time} key={time} />
        ))}
      </div>
    </div>
  )
}

export default TimeList

const row = css`
  display: flex;
  /* padding: 0.8rem; */
  border-bottom: 1px solid #dbdbdb;
  &:first-child {
    border-top: 1px solid #dbdbdb;
  }
`

const timeContainerStyle = css`
  margin: 0.8rem;
  padding: 0.8rem;
  /* width: 20%; */
`

const timeStyle = css`
  padding: 0.8rem;
  background-color: #f5f5f5;
`

const titleInput = css`
  height: 100%;
  width: 100%;
  border: 1px solid transparent;
  padding: 0 0.8rem;
  font-size: 1.6rem;
`

const title = css`
  flex-grow: 1;
`

type TimeRowProps = {
  time: TimeListType
}

const TimeRow: FC<TimeRowProps> = ({ time }) => {
  return (
    <div css={row}>
      <div css={timeContainerStyle}>
        <span css={timeStyle}>{time}</span>
      </div>
      <div css={title}>
        <input type="text" css={titleInput} />
      </div>
    </div>
  )
}
