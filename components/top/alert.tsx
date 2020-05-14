import { useEffect, FC } from "react"

const MIN_SEC = 60000
const TARGET_MIN = 50
const MESSAGE = "50分になりました。"
let timer = null

const checkNotification = () => {
  if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission()
  }
}

const showNotification = () => {
  const options = {
    body: MESSAGE,
  }
  new Notification("todolist3", options)
}

const setTimer = () => {
  const now = new Date()
  const nowSec = now.getMinutes()
  const diff = Math.abs(TARGET_MIN - nowSec)
  const fromNowSec =
    nowSec > TARGET_MIN ? (diff + TARGET_MIN) * MIN_SEC : diff * MIN_SEC
  return setTimeout(() => {
    showNotification()
    alert(MESSAGE)
    setTimer()
  }, fromNowSec)
}

export const Alert: FC = () => {
  useEffect(() => {
    if (!timer) {
      checkNotification()
      timer = setTimer()
    }
  }, [])
  return <></>
}
