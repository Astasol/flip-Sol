/**
 * Guide that shows up if Environment variables are not configured properly.
 */
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  ButtonGroup,
  Container,
  Controls,
  GlobalStyle,
  Input,
  Textarea,
} from './styles'
import { Config, getConfig } from './config'

const Wapper = styled.div`
  width: 360px;
`

const Info = styled.div`
  font-size: 11px;
  opacity: .8;
  text-align: left;
  padding: 5px;
`

export function SetupGuide() {
  const [config, setConfig] = useState(getConfig())
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const update = (u: Partial<Config>) => setConfig((c) => ({ ...c, ...u }))
  const env = useMemo(() => {
    return [
      `GAMBA_APP_NAME="${config.appName || ''}"`,
      `GAMBA_APP_LINK="${config.appLink || ''}"`,
      `GAMBA_CREATOR_ADDRESS="${config.creatorAddress}"`,
      `GAMBA_SOLANA_RPC="${config.rpcEndpoint || 'https://api.mainnet-beta.solana.com'}"`,
      `GAMBA_SOLANA_RPC_WS="${config.rpcWsEndpoint || ''}"`,
    ].join('\n\n')
  }, [config])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(env)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch {
      alert('Failed to copy. Copy manually')
    }
  }

  return (
    <Container>
      <GlobalStyle />
      <Wapper>
        <img src="/gamba.png" height="100" />
        {!generated ? (
          <Controls>
            <h1>Almost there!</h1>
            <div>
              Enter your Environment variables
            </div>
            <div>
              <Input
                placeholder="Solana address"
                value={config.creatorAddress}
                onChange={(evt) => update({ creatorAddress: evt.target.value })}
              />
              <Info>This wallet will collect fees. Please make sure it has been initialized by sending ~0.001 SOL to it!</Info>
            </div>
            <Input
              placeholder="RPC URL (Leave empty for default)"
              value={config.rpcEndpoint}
              onChange={(evt) => update({ rpcEndpoint: evt.target.value })}
            />
            <Input
              placeholder="Game title (e.g. Coin Flip)"
              value={config.appName}
              maxLength={100}
              onChange={(evt) => update({ appName: evt.target.value })}
            />
            <Input
              placeholder="Link to your website / social media"
              value={config.appLink}
              onChange={(evt) => update({ appLink: evt.target.value })}
            />
            <Button disabled={!config.creatorAddress} onClick={() => setGenerated(true)}>
              ✅ Generate .env
            </Button>
          </Controls>
        ) : (
          <Controls>
            <h1>Almost there!</h1>
            <Info>
              Vercel: Go to your Project dashboard → Settings on → Environment Variables, then paste the contents<br /><br />
              Locally: Create a file called {'".env"'} in your project folder, then paste the contents
            </Info>
            <Textarea
              style={{ height: '150px' }}
              value={env}
              onChange={() => null}
              spellCheck={false}
              onFocus={(e) => e.target.select()}
            />
            <ButtonGroup>
              <Button onClick={() => setGenerated(false)}>
               ❌ Go back
              </Button>
              <Button onClick={copy}>
                {!copied ? <>📝 Copy</> : <>✨ Copied!</>}
              </Button>
            </ButtonGroup>
          </Controls>
        )}
      </Wapper>
    </Container>
  )
}
