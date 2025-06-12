interface Props {
  providers: Array<React.ElementType>;
  children: React.ReactNode;
}

export const ComposeProviders: React.FC<Props> = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
      }, children)}
    </>
  );
};
