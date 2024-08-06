import { getPhotoUrl } from '@/lib/utils/misc'
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

import { CSSProperties } from 'react'

const main: CSSProperties = {
  fontFamily: 'Arial, sans-serif',
}

type SocialIconProps = {
  icon: string
  href: string
}

const SocialIcon = ({ icon, href }: SocialIconProps) => {
  return (
    <Column style={{ display: 'inline-block', padding: '0 8px' }}>
      <Link href={href} style={{ display: 'inline-block' }}>
        <Img width="34" style={{ display: 'block', margin: '0' }} src={icon} alt="logo" />
      </Link>
    </Column>
  )
}

type ItemProps = {
  title: string
  description: React.ReactNode
  image: string
}

const Item = ({ title, description, image }: ItemProps) => {
  return (
    <Row>
      <Column style={{ paddingBottom: '5px' }}>
        <div
          style={{
            width: '30%',
            maxWidth: '150px',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        >
          <div style={{ padding: '15px' }}>
            <Img
              aria-hidden="true"
              src={image}
              style={{
                maxWidth: '100%',
                display: 'block',
                margin: '0 auto',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
        <div
          style={{
            width: '70%',
            maxWidth: '360px',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        >
          <div
            style={{
              padding: '15px',
              textAlign: 'left',
              fontSize: '16px',
              lineHeight: '24px',
              color: '#004449',
            }}
          >
            <Text
              style={{
                margin: '0 0 16px',
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 'bold',
              }}
            >
              {title}
            </Text>
            {description}
          </div>
        </div>
      </Column>
    </Row>
  )
}

const GoingEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Yay! Cheap flights are headed your way</Preview>
      <Body style={main}>
        <Container bgcolor="D7FFC2" align="center">
          <Row>
            <Column style={{ padding: '20 15' }} align="center">
              <Text style={{ color: '#004449', margin: 0, fontSize: '16px', fontWeight: '700' }}>
                Clock&apos;s ticking on your limited time offer
              </Text>

              <Link
                href="/"
                style={{
                  color: '#004449',
                  display: 'inline-block',
                  textDecoration: 'none',
                }}
              >
                You have 24 hours to save on your first year of Premium or Elite{' '}
                <Img
                  src={getPhotoUrl('plane.png', 'going')}
                  width="16"
                  height="16"
                  style={{
                    display: 'inline-block',
                    outline: 'none',
                    border: 'none',
                    textDecoration: 'none',
                    aspectRatio: 'auto 16 / 16',
                  }}
                  alt="plane logo"
                />
              </Link>
            </Column>
          </Row>
        </Container>
        <Container bgcolor="004449">
          <Container style={{ padding: '30px' }}>
            <Container align="center" style={{ maxWidth: '450px', borderSpacing: '0' }}>
              <Row>
                <Column align="center">
                  <Link>
                    <Img src={getPhotoUrl('going-logo.png', 'going')} width="124" alt="Going" />
                  </Link>
                  <Heading
                    style={{
                      margin: '30px 0',
                      fontSize: '50px',
                      lineHeight: '56px',
                      fontWeight: 700,
                      color: '#fffef0',
                    }}
                  >
                    <span style={{ color: '#d7ffc2', fontWeight: 'normal' }}>Deals</span> coming
                    <span>
                      <br></br>
                    </span>{' '}
                    your way
                  </Heading>
                  <Text
                    style={{
                      margin: '0 0 30px',
                      color: '#fffef0',
                      fontSize: '16px',
                    }}
                  >
                    We are thrilled to help you never overpay for travel again. Keep your eyes peeled for deals from LAX
                    and other departure airports you follow.
                  </Text>

                  <Container
                    style={{
                      borderCollapse: 'separate',
                      height: '55px',
                    }}
                  >
                    <Button
                      href="/"
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        borderRadius: '30px',
                        height: '55px',
                        backgroundColor: '#483CFF',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        display: 'block',
                      }}
                    >
                      <span style={{ lineHeight: '55px' }}>VIEW MY CURRENT DEALS</span>
                    </Button>
                  </Container>
                </Column>
              </Row>
            </Container>
          </Container>
          <Img width="600" style={{ width: '100%' }} src={getPhotoUrl('locations.png', 'going')} alt="background" />
        </Container>
        <Container style={{ padding: '60px 15px 30px' }} bgcolor="FFFFFF">
          <Row>
            <Column align="center" valign="top">
              <Container>
                <Heading
                  style={{
                    color: '#004449',
                    textAlign: 'center',
                    margin: '0 0 24px',
                    fontSize: '24px',
                    lineHeight: '32px',
                    fontWeight: 700,
                  }}
                  as="h2"
                >
                  Tips to get the most bang for your buck with Going
                </Heading>
              </Container>
            </Column>
          </Row>
          <Item
            title="Get the Going app."
            image={getPhotoUrl('going-gif-1.gif', 'going')}
            description={
              <Text style={{ fontSize: '16px' }}>
                Never miss a deal with real-time flight alerts at your fingertips.
                <Link href="/" style={{ color: '#483cff', textDecoration: 'underline' }}>
                  Download on iOS and Android.
                </Link>
              </Text>
            }
          />
          <Item
            title="Set up your airports."
            image={getPhotoUrl('going-gif-2.gif', 'going')}
            description={
              <Text style={{ fontSize: '16px' }}>
                You’ll only receive deals from departure airports you follow.{' '}
                <Link href="/" style={{ color: '#483cff', textDecoration: 'underline' }}>
                  Choose airports
                </Link>{' '}
                like your biggest, closest, and maybe even your parent’s.
              </Text>
            }
          />
          <Item
            title="Get the Going app."
            image={getPhotoUrl('going-gif-3.gif', 'going')}
            description={
              <Text style={{ fontSize: '16px' }}>
                As a Limited member, you get access to Going’s best domestic flights. Check out{' '}
                <Link href="/" style={{ color: '#483cff', textDecoration: 'underline' }}>
                  your deals.
                </Link>
              </Text>
            }
          />
        </Container>
        <Container
          style={{
            padding: '30px 30px 60px',
            width: '100%',
            backgroundColor: '#FFFFFF',
          }}
          bgcolor="FFFFFF"
        >
          <Row align="center">
            <Column>
              <Container style={{ maxWidth: '480px' }}>
                <Row style={{ textAlign: 'center' }} align="center">
                  <SocialIcon icon={getPhotoUrl('facebook.png', 'going')} href="https://www.facebook.com" />
                  <SocialIcon icon={getPhotoUrl('instagram.png', 'going')} href="https://www.instagram.com" />
                  <SocialIcon icon={getPhotoUrl('x.png', 'going')} href="https://www.x.com" />
                  <SocialIcon icon={getPhotoUrl('tiktok.png', 'going')} href="https://www.tiktok.com" />
                  <SocialIcon icon={getPhotoUrl('youtube.png', 'going')} href="https://www.youtube.com" />
                </Row>
              </Container>
              <Container align="center" style={{ textAlign: 'center', padding: '24px 0 0' }}>
                <Link style={{ color: '#004449', fontSize: '12px' }}>© Scott’s Cheap Flights, Inc. DBA Going</Link>
                <Text
                  style={{
                    color: '#004449',
                    lineHeight: '16px',
                    margin: 0,
                    fontSize: '12px',
                  }}
                >
                  4845 Pearl East Circle, Suite 118
                  <br></br>
                  PMB 28648
                  <br></br>
                  Boulder, CO 80301-6112
                </Text>
                <Text style={{ color: '#004449', padding: '24px 0 0' }}>
                  <Link
                    href="/"
                    style={{
                      color: '#004449',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    Advertise
                  </Link>
                  &nbsp;|&nbsp;
                  <Link
                    href="/"
                    style={{
                      color: '#004449',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    Email Preferences
                  </Link>
                  &nbsp;|&nbsp;
                  <Link
                    href="/"
                    style={{
                      color: '#004449',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    Unsubscribe
                  </Link>
                </Text>
              </Container>
            </Column>
          </Row>
          <Row>
            <Column
              style={{
                padding: '24px 0 0',
                textAlign: 'center',
                fontSize: '12px',
                lineHeight: '16px',
                color: '#004449',
                fontStyle: 'italic',
              }}
            >
              Offer not combinable with other discounts or previous subscriptions. Redeemable only at{' '}
              <Link href="www.going.com">Going.com</Link>, not via the mobile app.
            </Column>
          </Row>
        </Container>
      </Body>
    </Html>
  )
}

export default GoingEmail
