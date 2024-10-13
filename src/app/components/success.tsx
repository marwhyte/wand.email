type Props = {
  height?: number
  width?: number
}

export default function Success({ height = 52, width = 52 }: Props) {
  return (
    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" height={height} width={width}>
      <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
      <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
  )
}
