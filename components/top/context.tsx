import { createContext, FC, useReducer, Dispatch } from "react"
import { reducer } from "./reducer"

export type UserInfo = {
  userName: string
  userId: string
}

type ContentPanel = {
  isShown: boolean
  timeListIndex: number
}

export type TimeListType = {
  time: string
  timeListIndex: number
  title: string
  content: string
}

export type TimeLists = TimeListType[]

export type StateType = {
  userInfo: UserInfo
  timeLists: TimeLists
  contentPanel: ContentPanel
}

type ContextValue = {
  state: StateType
  dispatch: Dispatch<any>
}

type ProviderProps = {
  children: React.ReactNode
}

const initialState: StateType = {
  userInfo: {
    userName: "",
    userId: "",
  },
  timeLists: [],
  contentPanel: {
    isShown: false,
    timeListIndex: -1,
  },
}

export const Store = createContext<ContextValue>({
  state: initialState,
  dispatch: () => null,
})

export const Provider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
}
