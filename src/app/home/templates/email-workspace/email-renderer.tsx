'use client'

import { Body, Head, Html, Preview } from '@react-email/components'
import EmailBlock from './email-components/email-block'

// const SanitizedText = ({ children, ...props }: { children?: ReactNode } & ComponentProps<typeof Text>) => (
//   // @ts-ignore
//   <Text {...props} value={undefined}>
//     {typeof children === 'string' ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
//   </Text>
// )

// const SanitizedHeading = ({ children, ...props }: { children?: ReactNode } & ComponentProps<typeof Heading>) => (
//   // @ts-ignore
//   <Heading {...props} value={undefined}>
//     {typeof children === 'string' ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
//   </Heading>
// )

// const SanitizedButton = ({ children, ...props }: { children?: ReactNode } & ComponentProps<typeof Button>) => (
//   // @ts-ignore
//   <Button {...props} value={undefined}>
//     {typeof children === 'string' ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
//   </Button>
// )

// const SanitizedLink = ({
//   children,
//   items,
//   ...props
// }: { children?: ReactNode; items?: Item[] } & ComponentProps<typeof Link>) => (
//   // @ts-ignore
//   <Link {...props} style={{ ...props.style, textDecoration: 'underline', cursor: 'pointer' }}>
//     {items ? (
//       items.map((item, index) => <Fragment key={item.id || index}>{renderSection(item)}</Fragment>)
//     ) : typeof children === 'string' ? (
//       <span dangerouslySetInnerHTML={{ __html: children }} />
//     ) : (
//       children
//     )}
//   </Link>
// )

// const renderBlock = (block: EmailBlock, setSelectedBlock?: (block: EmailBlock | null) => void) => {
//   const sanitizedContent =
//     typeof block.content === 'string'
//       ? sanitizeHtml(block.content, {
//           allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span'],
//           allowedAttributes: {
//             '*': ['style'],
//             a: ['href'],
//           },
//         })
//       : undefined

//   switch (block.type) {
//     case 'text':
//       return (
//         <SanitizedText onClick={() => setSelectedBlock?.(block)} {...block.attributes}>
//           {sanitizedContent}
//         </SanitizedText>
//       )
//     case 'image':
//       return (
//         <Img onClick={() => setSelectedBlock?.(block)} {...block.attributes} alt={block.attributes.alt || 'Image'} />
//       )
//     case 'button':
//       return (
//         <SanitizedButton onClick={() => setSelectedBlock?.(block)} {...block.attributes}>
//           {sanitizedContent}
//         </SanitizedButton>
//       )
//     case 'link':
//       return (
//         <SanitizedLink
//           onClick={() => setSelectedBlock?.(block)}
//           {...block.attributes}
//           href={setSelectedBlock ? undefined : block.attributes.href}
//         >
//           {sanitizedContent}
//         </SanitizedLink>
//       )
//     case 'container':
//       return (
//         <Container {...block.attributes}>
//           {block.rows.map((row, index) => (
//             <Fragment key={row.id || index}>{renderBlock(row, setSelectedBlock)}</Fragment>
//           ))}
//         </Container>
//       )
//     case 'row':
//       return (
//         <Row {...(block as RowBlock).attributes}>
//           {(block as RowBlock).columns.map((column, index) => (
//             <Fragment key={column.id || index}>{renderBlock(column, setSelectedBlock)}</Fragment>
//           ))}
//         </Row>
//       )
//     case 'column':
//       return (
//         <Column {...block.attributes}>
//           {block.blocks.map((subBlock, index) => (
//             <Fragment key={subBlock.id || index}>{renderBlock(subBlock, setSelectedBlock)}</Fragment>
//           ))}
//         </Column>
//       )
//     default:
//       return null
//   }
// }

const EmailRenderer = ({ template }: { template: Email }) => {
  console.log(template)
  return (
    <Html>
      <Head />
      <Preview>{template.preview}</Preview>
      <Body style={{ fontFamily: template.fontFamily, margin: 0 }}>
        {template.blocks.map((block) => (
          <EmailBlock key={block.id} block={block} />
        ))}
      </Body>
    </Html>
  )
}

export default EmailRenderer
