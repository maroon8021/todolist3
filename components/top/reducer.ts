import { StateType, UserInfo, TimeLists, TimeListType } from "./context"

export const ACTION_TYPE = {
  SET_USER_INFO: "SET_USER_INFO",
  INIT_TIME_LISTS: "INIT_TIME_LISTS",
  SET_TIME_LIST: "SET_TIME_LIST",
  SET_CONTENT_PANEL_FOCUS: "SET_CONTENT_PANEL_FOCUS",
} as const

type ACTION_TYPE = typeof ACTION_TYPE[keyof typeof ACTION_TYPE]

type ActionReturnType = {
  type: ACTION_TYPE
  payload: any // If this type is specfied, some params in "reducer" show errors
}

export const setUserInfo = ({
  userName,
  userId,
}: UserInfo): ActionReturnType => ({
  type: ACTION_TYPE.SET_USER_INFO,
  payload: {
    userName,
    userId,
  },
})

export const initTimeLists = (timeLists: TimeLists): ActionReturnType => ({
  type: ACTION_TYPE.INIT_TIME_LISTS,
  payload: {
    timeLists,
  },
})

export const setTimeList = ({
  time,
  timeListIndex,
  title,
  content,
}: TimeListType): ActionReturnType => ({
  type: ACTION_TYPE.SET_TIME_LIST,
  payload: { time, timeListIndex, title, content },
})

export const setContentPanelFocus = (
  timeListIndex: number,
  isShown: boolean
): ActionReturnType => ({
  type: ACTION_TYPE.SET_CONTENT_PANEL_FOCUS,
  payload: {
    timeListIndex,
    isShown,
  },
})

export type Actions =
  | typeof setUserInfo
  | typeof initTimeLists
  | typeof setTimeList
  | typeof setContentPanelFocus

type ActionType = ReturnType<Actions>

export const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case ACTION_TYPE.SET_USER_INFO: {
      const { userName, userId } = action.payload
      return {
        ...state,
        userInfo: {
          userName,
          userId,
        },
      }
    }

    case ACTION_TYPE.INIT_TIME_LISTS: {
      const { timeLists } = action.payload
      return {
        ...state,
        timeLists,
      }
    }

    case ACTION_TYPE.SET_TIME_LIST: {
      const { time, timeListIndex, title, content } = action.payload
      let timeLists = JSON.parse(JSON.stringify(state.timeLists)) // Deep Clone
      const contentPanel = {
        title,
        content,
        timeListIndex,
        isShown: true,
      }
      timeLists = timeLists.map((timelist) => {
        return timelist.timeListIndex !== timeListIndex
          ? timelist
          : {
              time,
              timeListIndex,
              title,
              content,
            }
      })
      return {
        ...state,
        timeLists,
        contentPanel,
      }
    }

    case ACTION_TYPE.SET_CONTENT_PANEL_FOCUS: {
      const targetTimeListIndex = action.payload.timeListIndex
      const targetTimeList = state.timeLists.find(
        (timelist) => timelist.timeListIndex === targetTimeListIndex
      )
      const { title, content, timeListIndex } = targetTimeList
      const contentPanel = {
        title,
        content,
        timeListIndex,
        isShown: action.payload.isShown,
      }
      return {
        ...state,
        contentPanel,
      }
    }

    default:
      break
  }
}
