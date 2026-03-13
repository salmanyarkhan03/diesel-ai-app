interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ size = 'md' }: LogoProps) {
  if (size === 'sm') {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="14" height="20" rx="3.5" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
        <rect x="6.5" y="6.5" width="9" height="6" rx="1.5" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="0.8" strokeOpacity="0.5"/>
        <rect x="8" y="8.5" width="3" height="1.2" rx="0.6" fill="#22c55e" fillOpacity="0.9"/>
        <rect x="8" y="11" width="5" height="1.2" rx="0.6" fill="#22c55e" fillOpacity="0.55"/>
        <path d="M18 10 Q24 10 24 16 L24 26" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <rect x="20" y="24" width="6" height="4" rx="2" fill="#22c55e"/>
        <rect x="3.5" y="24" width="15" height="2.5" rx="1.25" fill="#22c55e" fillOpacity="0.25"/>
      </svg>
    )
  }

  if (size === 'lg') {
    return (
      <svg width="220" height="50" viewBox="0 0 220 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="7" width="20" height="30" rx="4" fill="none" stroke="#22c55e" strokeWidth="1.6"/>
        <rect x="4" y="10" width="13" height="9" rx="2" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="0.9" strokeOpacity="0.5"/>
        <rect x="6" y="13" width="4" height="1.5" rx="0.75" fill="#22c55e" fillOpacity="0.9"/>
        <rect x="6" y="16" width="7" height="1.5" rx="0.75" fill="#22c55e" fillOpacity="0.55"/>
        <path d="M21 15 Q30 15 30 22 L30 37" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <rect x="24" y="34" width="8" height="5.5" rx="2.5" fill="#22c55e"/>
        <rect x="0.5" y="37" width="21" height="3.5" rx="1.75" fill="#22c55e" fillOpacity="0.25"/>
        <text x="40" y="34" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900" fontSize="30" letterSpacing="2">
          <tspan fill="#ffffff">DIESEL</tspan>
          <tspan fill="#22c55e"> AI</tspan>
        </text>
      </svg>
    )
  }

  // md (default)
  return (
    <svg width="160" height="36" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="5" width="14" height="22" rx="3" fill="none" stroke="#22c55e" strokeWidth="1.2"/>
      <rect x="3.5" y="7.5" width="9" height="6" rx="1.5" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="0.7" strokeOpacity="0.5"/>
      <rect x="5" y="9.5" width="3" height="1" rx="0.5" fill="#22c55e" fillOpacity="0.9"/>
      <rect x="5" y="11.5" width="5" height="1" rx="0.5" fill="#22c55e" fillOpacity="0.55"/>
      <path d="M15 10.5 Q21 10.5 21 15 L21 26" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <rect x="17" y="24" width="6" height="4" rx="2" fill="#22c55e"/>
      <rect x="0.5" y="27" width="15" height="2.5" rx="1.25" fill="#22c55e" fillOpacity="0.25"/>
      <text x="29" y="24" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900" fontSize="22" letterSpacing="1.5">
        <tspan fill="#ffffff">DIESEL</tspan>
        <tspan fill="#22c55e"> AI</tspan>
      </text>
    </svg>
  )
}
