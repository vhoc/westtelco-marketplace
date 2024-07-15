"use client"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ToastProps {
  type: "warning",
  children?: React.ReactNode | Array<React.ReactNode> | undefined
}

const Toast = ( { type = 'warning', children }: ToastProps ) => {

  return (
    <div
      className={`rounded-lg ${ type === "warning" ? 'bg-warning-100' : 'bg-sky-200' } p-[8px] flex gap-[10px]`}
    >
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        color={'#F5A524'}
        size="lg"
      />
      <div className="text-left text-sm">
        {children}
      </div>
    </div>
  )

}

export default Toast