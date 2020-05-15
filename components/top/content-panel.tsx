import { FC, useEffect, useContext, FormEvent, ChangeEvent } from "react"
import axios from "axios"
/** @jsx jsx */
import { css, jsx } from "@emotion/core"

import { Store } from "c/top/context"
import { setTimeList, setContentPanelFocus } from "c/top/reducer"

const stage = process.env.NODE_ENV === "development" ? "dev/" : "prod/"
const TIMELIST_POST_ENDPOINT = `${process.env.ENDPOINT}${stage}postTimeLists`

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

const ContentPanel: FC = () => {
  const { state, dispatch } = useContext(Store)
  const { time, timeListIndex, content, title } = state.timeLists.reduce(
    (acc, val) => {
      if (val.timeListIndex !== state.contentPanel.timeListIndex) {
        return acc
      }
      const { time, timeListIndex, content, title } = val
      return { time, timeListIndex, content, title }
    },
    { time: "", timeListIndex: -1, content: "", title: "" }
  )

  const updateTimeList = (value: string): void => {
    dispatch(setTimeList({ time, timeListIndex, content: value, title }))
  }
  const onBlur = async (e: FormEvent<HTMLTextAreaElement>): Promise<void> => {
    const { userId } = state.userInfo
    const { value } = e.currentTarget
    updateTimeList(value)
    await axios.post(TIMELIST_POST_ENDPOINT, {
      userId,
      timeListIndex,
      content: value,
      title,
    })
  }
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = e.currentTarget
    updateTimeList(value)
  }

  const bindWindowEvent = (e: KeyboardEvent): void => {
    if (e.code !== "Escape") {
      return
    }
    dispatch(setContentPanelFocus(0, false))
  }

  useEffect(() => {
    if (state.contentPanel.isShown) {
      document.body.addEventListener("keyup", bindWindowEvent)
    } else {
      document.body.removeEventListener("keyup", bindWindowEvent)
    }
  }, [state.contentPanel.isShown])
  return (
    <div css={container}>
      <h3 css={head}>{title}</h3>
      <textarea
        css={textarea}
        placeholder="Todays todo"
        value={content}
        onBlur={onBlur}
        onChange={onChange}
      ></textarea>
    </div>
  )
}

export default ContentPanel
