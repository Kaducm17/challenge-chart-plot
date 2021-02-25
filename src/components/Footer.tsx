


import React, { CSSProperties, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

const footerStyle = {
  background: '#cccc',
  width: '100%',
  padding: '10px',
  position: 'fixed',
  zIndex: 1000,
  bottom: 0,
  left: 0,
} as CSSProperties

const Footer = ({ children }: Props) => {
  return (
    <footer style={footerStyle}>
      {children}
    </footer>
  )
}

export default Footer
