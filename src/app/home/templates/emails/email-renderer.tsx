'use client'

import { addIdsToContainers } from '@/lib/utils/misc'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Text,
} from '@react-email/components'
import { ComponentProps, Fragment, ReactNode, useState } from 'react'
import sanitizeHtml from 'sanitize-html'

const SanitizedText = ({ children, ...props }: { children?: ReactNode } & ComponentProps<typeof Text>) => (
  // @ts-ignore
  <Text {...props} value={undefined}>
    {typeof children === 'string' ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
  </Text>
)

const SanitizedHeading = ({ children, ...props }: { children?: ReactNode } & ComponentProps<typeof Heading>) => (
  // @ts-ignore
  <Heading {...props} value={undefined}>
    {typeof children === 'string' ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
  </Heading>
)

const SanitizedButton = ({ children, ...props }: { children?: ReactNode } & ComponentProps<typeof Button>) => (
  // @ts-ignore
  <Button {...props} value={undefined}>
    {typeof children === 'string' ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
  </Button>
)

const SanitizedLink = ({
  children,
  items,
  ...props
}: { children?: ReactNode; items?: Item[] } & ComponentProps<typeof Link>) => (
  // @ts-ignore
  <Link {...props}>
    {items ? (
      items.map((item, index) => <Fragment key={item.id || index}>{renderSection(item)}</Fragment>)
    ) : typeof children === 'string' ? (
      <span dangerouslySetInnerHTML={{ __html: children }} />
    ) : (
      children
    )}
  </Link>
)

type Container = ComponentProps<typeof Container> & {
  items: Item[]
}

type Row = ComponentProps<typeof Row> & {
  items: Item[]
}

type Column = ComponentProps<typeof Column> & {
  items: Item[]
}

type Item =
  | ({ type: 'text'; value: string } & Omit<ComponentProps<typeof Text>, 'children'>)
  | ({ type: 'heading'; value: string } & Omit<ComponentProps<typeof Heading>, 'children'>)
  | ({ type: 'button'; value: string } & Omit<ComponentProps<typeof Button>, 'children'>)
  | ({ type: 'link'; value?: string; items?: Item[] } & Omit<ComponentProps<typeof Link>, 'children'>)
  | ({ type: 'image' } & ComponentProps<typeof Img>)
  | ({ type: 'container' } & Omit<Container, 'children'>)
  | ({ type: 'row' } & Omit<Row, 'children'>)
  | ({ type: 'column' } & Omit<Column, 'children'>)
  | ({ type: 'div'; items: Item[] } & React.HTMLAttributes<HTMLDivElement>)
  | ({ type: 'span'; value: string } & React.HTMLAttributes<HTMLSpanElement>)

export interface EmailTemplate {
  preview: string
  style: { fontFamily: string }
  containers: Container[]
}

const renderSection = (item: Item) => {
  // Get sanitized value of item.value if it exists and is string
  const sanitizedValue =
    'value' in item && typeof item.value === 'string'
      ? sanitizeHtml(item.value, {
          allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span'],
          allowedAttributes: {
            '*': ['style'],
            a: ['href'],
          },
        })
      : undefined

  switch (item.type) {
    case 'text':
      return <SanitizedText {...item}>{sanitizedValue}</SanitizedText>
    case 'heading':
      return <SanitizedHeading {...item}>{sanitizedValue}</SanitizedHeading>
    case 'button':
      return <SanitizedButton {...item}>{sanitizedValue}</SanitizedButton>
    case 'image':
      return <Img {...item} alt={item.alt || 'Image'} />
    case 'container':
      return (
        <Container {...item}>
          {item.items.map((subItem, index) => (
            <Fragment key={subItem.id || index}>{renderSection(subItem)}</Fragment>
          ))}
        </Container>
      )
    case 'row':
      return (
        <Row {...item}>
          {item.items.map((subItem, index) => (
            <Fragment key={subItem.id || index}>{renderSection(subItem)}</Fragment>
          ))}
        </Row>
      )
    case 'column':
      return (
        <Column {...item}>
          {item.items.map((subItem, index) => (
            <Fragment key={subItem.id || index}>{renderSection(subItem)}</Fragment>
          ))}
        </Column>
      )
    case 'link':
      return <SanitizedLink {...item}>{sanitizedValue}</SanitizedLink>
    case 'div':
      return (
        <div {...item}>
          {item.items.map((subItem, index) => (
            <Fragment key={subItem.id || index}>{renderSection(subItem)}</Fragment>
          ))}
        </div>
      )
    case 'span':
      return <span {...item} dangerouslySetInnerHTML={{ __html: sanitizedValue || '' }} />
    default:
      return null
  }
}

const EmailRenderer = ({ originalTemplate }: { originalTemplate: EmailTemplate }) => {
  const [template, setTemplate] = useState<EmailTemplate>(addIdsToContainers(originalTemplate))

  return (
    <Html>
      <Head />
      <Preview>{template.preview}</Preview>
      <Body>
        <Container style={template.style}>
          {template.containers.map((container, index) => (
            <Container key={container.id || index} {...container}>
              {container.items.map((item, itemIndex) => (
                <Fragment key={item.id || itemIndex}>{renderSection(item)}</Fragment>
              ))}
            </Container>
          ))}
        </Container>
      </Body>
    </Html>
  )
}

export default EmailRenderer
