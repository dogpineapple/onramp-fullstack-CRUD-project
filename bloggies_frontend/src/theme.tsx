import { createGlobalStyle } from 'styled-components';


export const DEFAULT_COLOR = {
  linkText: "#020202",
  linkHoverText: "#a9a9a9",
  displayNameText: "#a9a9a9",
  authorNameBlogCardText: "#020202",
  authorNamePostDetailText: "#EFEFEF",
  commentBodyText: "#4A4A4A"
}

export const PREMIUM_COLOR = {
  linkText: "#d59712",
  linkHoverText: "#efd53e",
}

export const premiumAppTheme = {
  body: '#363537',
  text: '#FAFAFA',
  cardText: '#363537'
}

export const defaultAppTheme = {
  body: '#FFFFFF',
  text: '#363537',
  cardText: "#363537"
}

export type MyProps = {
  theme: typeof premiumAppTheme;
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