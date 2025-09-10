'use client'

import { Modal, ModalProps } from 'antd'
import React, { forwardRef, useImperativeHandle, useState, Ref, JSX } from 'react'

export interface MyModalRef<T = void> {
  open: (data?: T) => void
  close: () => void
}

export interface TMModalProps<T = void> extends Omit<ModalProps, 'children'> {
  onConfirm?: () => void
  onCancel?: () => void
  children?: React.ReactNode | ((data: T | undefined) => React.ReactNode)
  fixHeight?: boolean
}

function TMModalInner<T>(
  { onConfirm, onCancel, children, ...restProps }: TMModalProps<T>,
  ref: Ref<MyModalRef<T>>,
) {
  const [isOpen, setOpen] = useState(false)
  const [payload, setPayload] = useState<T | undefined>()

  useImperativeHandle(ref, () => ({
    open: (data?: T) => {
      setPayload(data)
      setOpen(true)
    },
    close: () => setOpen(false),
  }))

  const handleOk = async () => {
    if (onConfirm) {
      try {
        await onConfirm()
        setOpen(false)
        setPayload(undefined)
      } catch (error) {
        setOpen(false)
        setPayload(undefined)
        throw error
      }
    }
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
    setPayload(undefined)
  }

  return (
    <Modal {...restProps} open={isOpen} onOk={handleOk} onCancel={handleCancel}>
      {typeof children === 'function' ? children(payload) : children}
    </Modal>
  )
}

// ✅ Proper forwardRef casting with generic T
export const TMModal = forwardRef(TMModalInner) as <T = void>(
  props: TMModalProps<T> & { ref?: Ref<MyModalRef<T>> },
) => JSX.Element
