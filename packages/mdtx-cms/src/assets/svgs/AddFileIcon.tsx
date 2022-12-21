export const AddFileIcon: React.FC<{ color?: string }> = ({
  color = '#9A99AD',
}) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.002 11V5.84c0-1.344 0-2.016-.254-2.53a2.367 2.367 0 0 0-1.02-1.048C13.23 2 12.576 2 11.268 2H6.734c-1.306 0-1.96 0-2.459.262-.439.23-.796.597-1.02 1.048C3 3.824 3 4.496 3 5.84v8.32c0 1.344 0 2.016.254 2.53.224.451.581.818 1.02 1.048.5.262 1.153.262 2.46.262H8m4 0v-6m-3 3h6"
      stroke={color ? color : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
