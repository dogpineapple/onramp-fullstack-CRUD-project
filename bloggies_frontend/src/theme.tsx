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
  cardText: '#363537',
  navBarBgColor: "#3712C8",
  navBarActiveLinkColor: "#A3C812"
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
  & .BlogCard {
    color: ${({ theme }) => theme.cardText};
  }
  & .NavBar {
    background-color: ${({ theme }) => theme.navBarBgColor};
  }
  & .NavBar-list a {
    color: white;
  }
  & .NavBar-list a:hover,
  .NavBar-list a.active,
  .NavBar-logout-btn:hover {
    color: ${({ theme }) => theme.navBarActiveLinkColor};
  }
  & .NavBar-list a.active {
    font-weight: 600;
  }
`