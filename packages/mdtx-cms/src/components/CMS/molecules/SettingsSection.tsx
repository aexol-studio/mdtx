import { useGitState } from '@/src/containers/GitContainer';
import Link from 'next/link';
import { useRouter } from 'next/router';
const URLTOGITLAB = `https://gitlab.aexol.com/oauth/authorize?client_id=ec4d617cc6783e6c3b4d5cdbd99e76933c25c4a5eba59e263115d2a37e8cc674&redirect_uri=http://localhost:3000/editor/&response_type=code&state=SETTINGSGITLAB&scope=api`;

const MDTXonGitHub = `https://github.com/login/oauth/authorize?scope=repo%20read:user%20write:org%20read:org&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&state=SETTINGSGITHUB&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

export const SettingsSection: React.FC<{ active: boolean }> = ({ active }) => {
  const { connections } = useGitState();
  const addedConnections = connections.map((o) => o.service);
  const router = useRouter();
  return (
    <div
      className={`${
        active
          ? 'translate-x-[0%] duration-[900ms]'
          : 'translate-x-[-600px] duration-[300ms]'
      } w-full h-full transition-transform ease-in-out left-[5.2rem] absolute flex flex-col z-[1]`}
    >
      {!addedConnections.includes('github') && (
        <Link href={MDTXonGitHub} className="text-editor-light2">
          Integrate with github
        </Link>
      )}
      {!addedConnections.includes('gitlab') && (
        <Link href={URLTOGITLAB} className="text-editor-light2">
          Integrate with gitlab
        </Link>
      )}
    </div>
  );
};
