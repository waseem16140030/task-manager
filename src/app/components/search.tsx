'use client'
import { Input, InputProps, theme } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import { useMemo, useCallback, useEffect, useRef } from 'react'

export function SearchInput({
  onChange,
  debounceDelay = 500,
  ...restProps
}: InputProps & { debounceDelay?: number }) {
  const { token } = theme.useToken()

  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const debouncedOnChange = useMemo(() => {
    return debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeRef.current?.(e)
    }, debounceDelay)
  }, [debounceDelay])

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist()
      debouncedOnChange(e)
    },
    [debouncedOnChange],
  )

  return (
    <Input
      prefix={<SearchOutlined style={{ color: token.colorIcon }} />}
      allowClear
      onChange={handleChange}
      {...restProps}
    />
  )
}
