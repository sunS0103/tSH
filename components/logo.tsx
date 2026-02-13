// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Logo(props: any) {
  return (
    <svg
      width="200"
      height="32"
      viewBox="0 0 200 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Purple gradient arc - shortened and centered above SmartTechHire */}
      <path d="M 25 8 Q 77 2 129 8" stroke="url(#paint0_linear_2505_8218)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      
      {/* SmartTechHire Text - no spaces, all bold */}
      <text x="2" y="24" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#000000">SmartTechHire</text>
      
      <defs>
        <linearGradient id="paint0_linear_2505_8218" x1="25" y1="8" x2="129" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5245E5" />
          <stop offset="1" stopColor="#9134EA" />
        </linearGradient>
      </defs>
    </svg>
  );
}
