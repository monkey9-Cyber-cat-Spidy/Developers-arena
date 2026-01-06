const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const classes = ['btn', variant, className].filter(Boolean).join(' ')
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
