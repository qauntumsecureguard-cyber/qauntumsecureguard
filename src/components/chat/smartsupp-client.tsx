"use client"

import { useEffect } from "react"

export default function SmartsuppClient() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // attach global config
    ;(window as any)._smartsupp = (window as any)._smartsupp || {}
    ;(window as any)._smartsupp.key = '8f408ada15798a4005075260fdf9276220104127'

    // don't double-insert the script
    if (document.getElementById("smartsupp-loader")) return

    const s = document.getElementsByTagName("script")[0]
    const c = document.createElement("script")
    c.id = "smartsupp-loader"
    c.type = "text/javascript"
    c.charset = "utf-8"
    c.async = true
    c.src = "https://www.smartsuppchat.com/loader.js?"
    s.parentNode?.insertBefore(c, s)
  }, [])

  return (
    <noscript>
      Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noreferrer">Smartsupp</a>
    </noscript>
  )
}
