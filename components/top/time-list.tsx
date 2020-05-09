import {
  FC,
  useContext,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react"
import axios from "axios"
/** @jsx jsx */
import { css, jsx } from "@emotion/core"

import { Store, TimeLists, TimeListType } from "c/top/context"
import { initTimeLists, setTimeList, setContentPanelFocus } from "c/top/reducer"

const stage = process.env.NODE_ENV === "development" ? "dev/" : "prod/"
const TIMELIST_GET_ENDPOINT = `${process.env.ENDPOINT}${stage}getTimeLists`
const TIMELIST_POST_ENDPOINT = `${process.env.ENDPOINT}${stage}postTimeLists`

const TimeStrLists = [
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

const TimeList: FC = () => {
  const { state, dispatch } = useContext(Store)
  useEffect(() => {
    async function initializeTimeLists() {
      if (state.userInfo.userId === "") {
        return
      }
      const baseTimeLists: TimeLists = TimeStrLists.map(
        (timeListStr, index) => {
          return {
            time: timeListStr,
            timeListIndex: index,
            title: "",
            content: "",
          }
        }
      )
      try {
        const res = await axios.get(TIMELIST_GET_ENDPOINT, {
          params: {
            userId: state.userInfo.userId,
          },
        })
        const fetchedTimeLists: TimeLists = baseTimeLists.map((base, index) => {
          const { time, timeListIndex } = base
          let { title, content } = res.data.timelists[index]
          title = title.trim()
          content = content.trim()
          return {
            time,
            timeListIndex,
            title,
            content,
          }
        })
        dispatch(initTimeLists(fetchedTimeLists))
      } catch (error) {
        //console.log(error)
      }
    }

    initializeTimeLists()
  }, [state.userInfo.userName]) // When userName is got, This effect should be fired
  return (
    <div css={container}>
      <h3 css={head}>TimeList</h3>
      <div css={lists}>
        {state.timeLists.map((time) => (
          <TimeRow
            time={time.time}
            title={time.title}
            timeListIndex={time.timeListIndex}
            content={time.content}
            key={`${time.time}-${time.timeListIndex}`}
          />
        ))}
      </div>
    </div>
  )
}

export default TimeList

const row = css`
  display: flex;
  position: relative;
  /* padding: 0.8rem; */
  border-bottom: 1px solid #dbdbdb;
  &:first-of-type {
    border-top: 1px solid #dbdbdb;
  }
`

const passedRow = css`
  ${row}
  background-color: #b0bec5;
  /*
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #b0bec5;
    opacity: 0.3;
  }
  */
`

const timeContainerStyle = css`
  margin: 0.8rem;
  padding: 0.8rem;
  min-width: max-content;
  /* width: 20%; */
`

const timeStyle = css`
  padding: 0.8rem;
  background-color: #f5f5f5;
`

const timeStylePassed = css`
  ${timeStyle}
  background-color: #b0bec5;
`

const titleArea = css`
  width: 100%;
`

const titleInput = css`
  height: 100%;
  width: 100%;
  border: 1px solid transparent;
  padding: 0 0.8rem;
  font-size: 1.6rem;
`

const titleInputPassed = css`
  ${titleInput}
  background-color: #b0bec5;
`

type TimeRowProps = TimeListType
// Pick<TimeListType, "time" | "timeListIndex" | "title">

const TimeRow: FC<TimeRowProps> = ({ time, title, timeListIndex, content }) => {
  const { state, dispatch } = useContext(Store)
  const [isPassed, setPassed] = useState(false)

  const updateTimeList = (value: string): void => {
    dispatch(setTimeList({ time, timeListIndex, content, title: value }))
  }
  const onBlur = async (e: FormEvent<HTMLInputElement>): Promise<void> => {
    const { userId } = state.userInfo
    const { value } = e.currentTarget
    await axios.post(TIMELIST_POST_ENDPOINT, {
      userId,
      timeListIndex,
      content,
      title: value,
    })
  }
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget
    updateTimeList(value)
  }

  const onFocus = (): void => {
    dispatch(setContentPanelFocus(timeListIndex, true))
  }

  useEffect(() => {
    const endHour = parseInt(time.match(/~ (.+):00/)[1])
    const nowHour = new Date().getHours()
    setPassed(endHour <= nowHour)
  })
  return (
    <div css={isPassed ? passedRow : row}>
      <div css={timeContainerStyle}>
        <span css={isPassed ? timeStylePassed : timeStyle}>{time}</span>
      </div>
      <div css={titleArea}>
        <input
          type="text"
          css={isPassed ? titleInputPassed : titleInput}
          defaultValue={title}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
        />
      </div>
    </div>
  )
}
