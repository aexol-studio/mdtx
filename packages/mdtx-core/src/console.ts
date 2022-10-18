import chalk from 'chalk';
type Colors = keyof Pick<
  typeof chalk,
  'red' | 'yellow' | 'greenBright' | 'yellowBright' | 'redBright' | 'blueBright'
>;
export const message = (m: string, color: Colors) => {
  console.log(chalk[color](m));
};

export const calcTime = (m: string, color: Colors) => {
  console.time(chalk[color](m));
  return {
    end: () => console.timeEnd(chalk[color](m)),
  };
};
