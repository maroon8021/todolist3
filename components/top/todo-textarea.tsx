import { useEffect, useState, useContext, FormEvent } from "react"
import axios from "axios"
/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Store } from "c/top/context"

const stage = process.env.NODE_ENV === "development" ? "dev/" : "prod/"
const REMAINING_TASKS_GET_ENDPOINT = `${process.env.ENDPOINT}${stage}getRemainingTasks`
const REMAINING_TASKS_POST_ENDPOINT = `${process.env.ENDPOINT}${stage}postRemaingTasks`

const container = css`
  padding: 3rem 0;
  width: 100%;
`

const head = css`
  font-size: 2rem;
  margin-bottom: 1.6rem;
`

const textarea = css`
  min-height: 20rem;
  width: 100%;
  border-radius: 3px;
  padding: 1rem;
`

const TodoTextarea = () => {
  const [remainigTasks, setRemainigTasks] = useState("")
  const { state } = useContext(Store)
  useEffect(() => {
    async function fetchRemainigTasks() {
      if (state.userInfo.userId === "") {
        return
      }
      try {
        const res = await axios.get(REMAINING_TASKS_GET_ENDPOINT, {
          params: {
            userId: state.userInfo.userId,
          },
        })
        //console.log(res)
        setRemainigTasks(res.data.content)
      } catch (error) {
        //console.log(error)
      }
    }
    fetchRemainigTasks()
  }, [state.userInfo]) // When initialize userInfo?

  const onBlur = (e: FormEvent<HTMLTextAreaElement>): void => {
    const { value } = e.currentTarget
    const { userId } = state.userInfo
    axios
      .post(REMAINING_TASKS_POST_ENDPOINT, {
        userId,
        content: value,
      })
      .then((res) => {
        //console.log(res)
      })
    setRemainigTasks(value)
  }
  return (
    <div css={container}>
      <h3 css={head}>Remaining Tasks</h3>
      <textarea
        css={textarea}
        placeholder="Todays todo"
        defaultValue={remainigTasks}
        onBlur={onBlur}
      ></textarea>
    </div>
  )
}

export default TodoTextarea
