import Link from 'next/link';
interface ButtonInterface {
  type?: 'form' | 'link';
  href?: string;
  text: string;
  color: 'orange' | 'white';
  customClassName?: string;
  withAnimation?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonInterface> = ({
  type,
  href,
  text,
  color,
  customClassName,
  withAnimation,
  onClick,
}) => (
  <div
    onClick={() => onClick && onClick()}
    className={`${
      withAnimation ? 'transition-all duration-300 ease-in-out' : ''
    } ${
      color === 'orange'
        ? 'bg-mdtxOrange0 text-mdtxWhite hover:text-mdtxBlack'
        : color === 'white'
        ? 'bg-mdtxWhite text-mdtxOrange0 hover:text-mdtxBlack'
        : ''
    } ${
      customClassName ? customClassName : ''
    } z-[102] cursor-pointer h-fit flex justify-center items-center text-[1.4rem] rounded-[2.4rem] overflow-hidden w-fit`}
  >
    {type ? (
      type === 'form' ? (
        <input
          className="appearance-none cursor-pointer"
          type="submit"
          value={text}
        ></input>
      ) : (
        type === 'link' &&
        href && (
          <Link
            className="hover:no-underline px-[2.4rem] py-[0.4rem] text-[1.4rem]"
            href={href}
          >
            {text}
          </Link>
        )
      )
    ) : (
      <button className="px-[2.4rem] py-[0.4rem] text-[1.4rem]">{text}</button>
    )}
  </div>
);
