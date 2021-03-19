import { createGlobalStyle } from 'styled-components';

export const premiumTheme = {
  body: '#363537',
  text: '#FAFAFA',
  cardText: '#363537'
}

export const defaultTheme = {
  body: '#FFFFFF',
  text: '#363537',
  cardText: "#363537"
}

export type MyProps = {
  theme: typeof premiumTheme;
}

export const GlobalStyles = createGlobalStyle<MyProps>`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }
  & .BlogCard {
    color: ${({ theme }) => theme.cardText};
  }
`