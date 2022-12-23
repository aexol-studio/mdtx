export const SettingsIcon: React.FC<{ color?: string }> = ({
  color = '#E1E5EE',
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 9L11 14L9 12M7 18C4.2386 18 2 15.7017 2 12.8667C2 10.3515 3.76186 8.25889 6.08758 7.81861C7.02452 5.58105 9.31861 4 12 4C15.3583 4 18.109 6.48004 18.3469 9.62378C20.4004 9.8481 22 11.6323 22 13.8C22 16.1196 20.1684 18 17.9091 18C14.1707 18 11.4089 18 7 18Z"
        stroke={color ? color : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
