"use client"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"

interface ToastProps {
  type: "warning" | "error" | "info",
  children?: React.ReactNode | Array<React.ReactNode> | undefined
}

const Toast = ( { type = 'warning', children }: ToastProps ) => {

  return (
    <div
      className={clsx(
        `rounded-lg`,
        type === "error" ? 'bg-danger-100' : '',
        type === "warning" ? 'bg-warning-100' : '',
        type === "info" ? 'bg-blue-100' : '',
        `p-[8px] flex gap-[10px]`
      )}
    >
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        color={
          type === "error" ? '##cd3131' :
          type === "warning" ?'#F5A524' :
          type === "info" ?'#2472c8' :
            'black'
        }
        className={clsx(
          type === "error" ? 'text-red-600' : null,
          type === "warning" ? 'text-[#F5A524]' : null,
          type === "info" ? 'text-[#2472c8]' : null,
        )}
        size="lg"
      />
      <div className="text-left text-sm">
        {children}
      </div>
    </div>
  )

}

export default Toast