import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { EmblaCarouselType } from 'embla-carousel'
import { useCallback, useEffect, useState } from 'react'

export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  }
}

export const PrevButton = (props: { children?: React.ReactNode; disabled: boolean; onClick: () => void }) => {
  const { children, ...restProps } = props

  return (
    <button className="embla__button embla__button--prev" type="button" {...restProps}>
      <ChevronLeftIcon className="embla__button__svg" />
      {children}
    </button>
  )
}

export const NextButton = (props: { children?: React.ReactNode; disabled: boolean; onClick: () => void }) => {
  const { children, ...restProps } = props

  return (
    <button className="embla__button embla__button--next" type="button" {...restProps}>
      <ChevronRightIcon className="embla__button__svg" />
      {children}
    </button>
  )
}
